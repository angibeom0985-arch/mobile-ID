import React, { useState, useEffect } from 'react';

// API Base URL - 개발환경과 프로덕션 환경 구분
const API_BASE_URL = (import.meta.env && import.meta.env.MODE === 'production')
  ? 'https://your-production-api.com' // TODO: 배포 후 실제 URL로 변경
  : 'http://localhost:5000';

type View = 'main' | 'oil' | 'station' | 'traffic';

type OilPrice = {
  prodcd: string;
  prodnm: string;
  price: string;
  diff: string;
};

type GasStation = {
  id: string;
  name: string;
  address: string;
  distance: number;
  gasoline?: string;
  diesel?: string;
  lpg?: string;
  lat: string;
  lng: string;
};

type TrafficInfo = {
  routeName: string;
  startName: string;
  endName: string;
  congestion: string;
  speed: string;
};

// ==================== 오일 가격 뷰 ====================
const OilPriceView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [oilPrices, setOilPrices] = useState<OilPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOilPrices();
  }, []);

  const fetchOilPrices = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 백엔드 API 호출 (더 이상 프록시 불필요, API 키도 노출되지 않음)
      const response = await fetch(`${API_BASE_URL}/api/oil-price`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && Array.isArray(result.data)) {
        setOilPrices(result.data);
        // 폴백 데이터인 경우 사용자에게 알림
        if (result.fallback && result.message) {
          setError(result.message);
        }
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }
      
    } catch (err) {
      console.error('유가 정보 로드 오류:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const getOilIcon = (name: string) => {
    if (name.includes('휘발유')) return 'fa-gas-pump';
    if (name.includes('경유')) return 'fa-truck';
    if (name.includes('LPG')) return 'fa-fire';
    return 'fa-droplet';
  };

  const getOilColor = (name: string) => {
    if (name.includes('휘발유')) return 'text-green-400';
    if (name.includes('경유')) return 'text-yellow-400';
    if (name.includes('LPG')) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="text-white w-full max-w-4xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
        <i className="fa-solid fa-gas-pump"></i>
        오늘의 전국 평균 기름값
      </h2>

      {loading && (
        <div className="text-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-teal-400"></i>
          <p className="mt-4 text-gray-400">데이터를 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
          <i className="fa-solid fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {!loading && !error && oilPrices.length > 0 && (
        <div className="space-y-4">
          {oilPrices.map((oil, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <i className={`fa-solid ${getOilIcon(oil.prodnm)} text-3xl ${getOilColor(oil.prodnm)}`}></i>
                  <div>
                    <h3 className="text-2xl font-bold">{oil.prodnm}</h3>
                    <p className="text-sm text-gray-400">전국 평균 가격</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-teal-400">{oil.price}원</p>
                  <p className={`text-sm ${parseFloat(oil.diff) > 0 ? 'text-red-400' : parseFloat(oil.diff) < 0 ? 'text-blue-400' : 'text-gray-400'}`}>
                    {parseFloat(oil.diff) > 0 ? '▲' : parseFloat(oil.diff) < 0 ? '▼' : '―'} {Math.abs(parseFloat(oil.diff))}원 (전주 대비)
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center text-sm text-gray-500 mt-6">
            <i className="fa-solid fa-info-circle mr-2"></i>
            자료출처: 한국석유공사 오피넷 (OPINET)
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== 주유소 검색 뷰 ====================
const GasStationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocationPermission('granted');
          fetchNearbyStations(lat, lng);
        },
        (error) => {
          setLocationPermission('denied');
          setError('위치 권한이 필요합니다. 브라우저 설정에서 위치 권한을 허용해주세요.');
          setLoading(false);
        }
      );
    } else {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      setLoading(false);
    }
  };

  const fetchNearbyStations = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      setError('');
      
      // 백엔드 API 호출 (lat, lng 파라미터 전달)
      const response = await fetch(`${API_BASE_URL}/api/nearby-stations?lat=${lat}&lng=${lng}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && Array.isArray(result.data)) {
        setStations(result.data);
        // 폴백 데이터인 경우 사용자에게 알림
        if (result.fallback && result.message) {
          setError(result.message);
        }
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }
      
    } catch (err) {
      console.error('주유소 정보 로드 오류:', err);
      setError('주유소 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white w-full max-w-4xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
        <i className="fa-solid fa-location-dot"></i>
        내 주변 주유소
      </h2>

      {locationPermission === 'prompt' && !loading && !error && (
        <div className="bg-blue-900/30 border border-blue-500 text-blue-300 p-6 rounded-lg text-center">
          <i className="fa-solid fa-location-crosshairs text-4xl mb-4"></i>
          <h3 className="text-xl font-bold mb-2">위치 권한이 필요합니다</h3>
          <p className="text-gray-300 mb-4">주변 주유소를 찾기 위해 현재 위치 정보가 필요합니다.</p>
          <button
            onClick={requestLocation}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-location-arrow mr-2"></i>
            위치 권한 허용하기
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-400"></i>
          <p className="mt-4 text-gray-400">주변 주유소를 검색하는 중...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
          <i className="fa-solid fa-exclamation-triangle mr-2"></i>
          <p>{error}</p>
          {locationPermission === 'denied' && (
            <button
              onClick={requestLocation}
              className="mt-4 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <i className="fa-solid fa-rotate mr-2"></i>
              다시 시도
            </button>
          )}
        </div>
      )}

      {!loading && !error && stations.length > 0 && (
        <div className="space-y-4">
          {stations.slice(0, 10).map((station, index) => (
            <div key={station.id || index} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{station.name}</h3>
                  <p className="text-sm text-gray-400">{station.address}</p>
                  <p className="text-sm text-blue-400 mt-1">
                    <i className="fa-solid fa-location-arrow mr-1"></i>
                    {station.distance ? `${(station.distance / 1000).toFixed(1)}km` : '거리 정보 없음'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {station.gasoline && (
                  <div className="bg-gray-700 p-3 rounded-md text-center">
                    <p className="text-xs text-gray-400 mb-1">휘발유</p>
                    <p className="text-lg font-bold text-green-400">{station.gasoline}원</p>
                  </div>
                )}
                {station.diesel && (
                  <div className="bg-gray-700 p-3 rounded-md text-center">
                    <p className="text-xs text-gray-400 mb-1">경유</p>
                    <p className="text-lg font-bold text-yellow-400">{station.diesel}원</p>
                  </div>
                )}
                {station.lpg && (
                  <div className="bg-gray-700 p-3 rounded-md text-center">
                    <p className="text-xs text-gray-400 mb-1">LPG</p>
                    <p className="text-lg font-bold text-blue-400">{station.lpg}원</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="text-center text-sm text-gray-500 mt-6">
            <i className="fa-solid fa-info-circle mr-2"></i>
            자료출처: 한국석유공사 오피넷 (OPINET)
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== 실시간 도로 소통 뷰 ====================
const TrafficView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [trafficData, setTrafficData] = useState<TrafficInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrafficData();
  }, []);

  const fetchTrafficData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 백엔드 API 호출
      const response = await fetch(`${API_BASE_URL}/api/traffic-info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && Array.isArray(result.data)) {
        setTrafficData(result.data);
        // 폴백 데이터인 경우 사용자에게 알림
        if (result.fallback && result.message) {
          setError(result.message);
        }
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }
      
    } catch (err) {
      console.error('도로 소통 정보 로드 오류:', err);
      setError('도로 소통 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const getCongestionColor = (congestion: string) => {
    if (congestion.includes('원활')) return 'text-green-400';
    if (congestion.includes('서행')) return 'text-yellow-400';
    if (congestion.includes('정체')) return 'text-red-400';
    return 'text-gray-400';
  };

  const getCongestionBg = (congestion: string) => {
    if (congestion.includes('원활')) return 'bg-green-900/30 border-green-500';
    if (congestion.includes('서행')) return 'bg-yellow-900/30 border-yellow-500';
    if (congestion.includes('정체')) return 'bg-red-900/30 border-red-500';
    return 'bg-gray-900/30 border-gray-500';
  };

  return (
    <div className="text-white w-full max-w-4xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
        <i className="fa-solid fa-road"></i>
        실시간 고속도로 소통 정보
      </h2>

      {loading && (
        <div className="text-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-purple-400"></i>
          <p className="mt-4 text-gray-400">도로 소통 정보를 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
          <i className="fa-solid fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {!loading && !error && trafficData.length > 0 && (
        <div className="space-y-4">
          {trafficData.map((traffic, index) => (
            <div key={index} className={`p-6 rounded-lg border-2 ${getCongestionBg(traffic.congestion)}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{traffic.routeName}</h3>
                  <p className="text-sm text-gray-400">
                    {traffic.startName} → {traffic.endName}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getCongestionColor(traffic.congestion)}`}>
                    {traffic.congestion}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    평균 {traffic.speed}km/h
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center text-sm text-gray-500 mt-6">
            <i className="fa-solid fa-info-circle mr-2"></i>
            자료출처: 한국도로공사
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== 메인 뷰 ====================
const MainView: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  useEffect(() => {
    const loadAds = () => {
      try {
        if (typeof window !== 'undefined') {
          const ads = document.querySelectorAll('.adsbygoogle');
          if (ads.length > 0 && (window as any).adsbygoogle) {
            ads.forEach((ad) => {
              if (!ad.hasAttribute('data-adsbygoogle-status')) {
                try {
                  ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                } catch (err) {
                  // AdSense 로드 실패는 무시
                }
              }
            });
          }
        }
      } catch (e) {
        // 광고 로드 실패는 조용히 처리
      }
    };
    
    const timer = setTimeout(loadAds, 500);
    return () => clearTimeout(timer);
  }, []);

  const issuanceCards = [
    {
      type: 'link',
      label: '발급 바로가기',
      backLabel: '모바일 주민등록증',
      href: 'https://mobile-id2.car-hotissue.com/%eb%aa%a8%eb%b0%94%ec%9d%bc-%ec%a3%bc%eb%af%bc%eb%93%b1%eb%a1%9d%ec%a6%9d-%eb%b0%9c%ea%b8%89/',
      icon: 'fa-solid fa-id-card',
      theme: 'blue'
    },
    {
      type: 'link',
      label: '발급 바로가기',
      backLabel: '모바일 운전면허증',
      href: 'https://mobile-id2.car-hotissue.com/%eb%aa%a8%eb%b0%94%ec%9d%bc-%ec%9a%b4%ec%a0%84%eb%a9%b4%ed%97%88%ec%a6%9d-%eb%b0%9c%ea%b8%89/',
      icon: 'fa-solid fa-car',
      theme: 'green'
    },
    {
      type: 'link',
      label: '발급 바로가기',
      backLabel: '모바일 건강보험증',
      href: 'https://mobile-id2.car-hotissue.com/%eb%aa%a8%eb%b0%94%ec%9d%bc-%ea%b1%b4%ea%b0%95%eb%b3%b4%ed%97%98%ec%a6%9d-%eb%b0%9c%ea%b8%89/',
      icon: 'fa-solid fa-book-medical',
      theme: 'red'
    }
  ];

  const featureCards = [
    {
      type: 'nav',
      label: '확인하러 가기',
      backLabel: '오늘의 기름값',
      view: 'oil',
      icon: 'fa-solid fa-gas-pump',
      theme: 'orange'
    },
    {
      type: 'nav',
      label: '찾아보기',
      backLabel: '내 주변 주유소',
      view: 'station',
      icon: 'fa-solid fa-location-dot',
      theme: 'indigo'
    },
    {
      type: 'nav',
      label: '확인하기',
      backLabel: '실시간 도로 소통',
      view: 'traffic',
      icon: 'fa-solid fa-road',
      theme: 'purple'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* 발급 방법 섹션 */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <i className="fa-solid fa-id-badge mr-3"></i>
            모바일 신분증 종류
          </h2>
          <p className="text-gray-400 text-sm md:text-base">발급 방법을 확인하고 바로 발급받으세요</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 justify-items-center max-w-4xl mx-auto">
          {issuanceCards.map((card, index) => {
            const cardContent = (
              <div className={`card ${card.theme}`}>
                <div className="content">
                  <div className="back">
                    <div className="back-content">
                      <i className={`text-5xl ${card.icon}`}></i>
                      <strong>{card.backLabel}</strong>
                    </div>
                  </div>
                  <div className="front">
                    <div className="img">
                      <div className="circle"></div>
                      <div className="circle" id="right"></div>
                      <div className="circle" id="bottom"></div>
                    </div>
                    <div className="front-content">
                      <div className="description">
                        <div className="title">
                          <p className="title flex items-center gap-4">
                            <i className={`text-2xl ${card.icon}`}></i>
                            <strong>{card.label}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );

            return (
              <a key={index} href={card.href} target="_blank" rel="noopener noreferrer">
                {cardContent}
              </a>
            );
          })}
          
          {/* 4번째 위치에 광고 추가 */}
          <div className="flex items-center justify-center" style={{ width: '190px', height: '254px' }}>
            <ins className="adsbygoogle"
                 style={{ display: 'block', width: '190px', height: '254px' }}
                 data-ad-client="ca-pub-2686975437928535"
                 data-ad-slot="1992799632"
                 data-ad-format="auto"
                 data-full-width-responsive="false"></ins>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <i className="fa-solid fa-compass mr-3"></i>
            편리한 기능
          </h2>
          <p className="text-gray-400 text-sm md:text-base">실시간 정보를 한눈에 확인하세요</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-items-center max-w-3xl mx-auto">
          {featureCards.map((card, index) => (
            <div 
              key={index} 
              className={`card ${card.theme} cursor-pointer`}
              onClick={() => onNavigate(card.view as View)}
            >
              <div className="content">
                <div className="back">
                  <div className="back-content">
                    <i className={`text-5xl ${card.icon}`}></i>
                    <strong>{card.backLabel}</strong>
                  </div>
                </div>
                <div className="front">
                  <div className="img">
                    <div className="circle"></div>
                    <div className="circle" id="right"></div>
                    <div className="circle" id="bottom"></div>
                  </div>
                  <div className="front-content">
                    <div className="description">
                      <div className="title">
                        <p className="title flex items-center gap-4">
                          <i className={`text-2xl ${card.icon}`}></i>
                          <strong>{card.label}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 광고 섹션 */}
      <section className="w-full max-w-4xl mx-auto">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-2686975437928535"
             data-ad-slot="1992799632"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </section>
    </div>
  );
};

// ==================== 메인 앱 컴포넌트 ====================
const App: React.FC = () => {
  const [view, setView] = useState<View>('main');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as View;
      if (hash && hash !== 'main') {
        setView(hash);
      } else {
        setView('main');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToView = (newView: View) => {
    if (newView === 'main') {
      window.history.replaceState(null, '', window.location.pathname);
      setView('main');
    } else {
      window.location.hash = newView;
      setView(newView);
    }
  };

  const goBack = () => {
    setView('main');
    window.history.replaceState(null, '', window.location.pathname);
  };

  const renderView = () => {
    switch (view) {
      case 'oil':
        return <OilPriceView onBack={goBack} />;
      case 'station':
        return <GasStationView onBack={goBack} />;
      case 'traffic':
        return <TrafficView onBack={goBack} />;
      case 'main':
      default:
        return <MainView onNavigate={navigateToView} />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      {renderView()}
    </div>
  );
};

export default App;
