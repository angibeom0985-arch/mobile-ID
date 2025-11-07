import React, { useState, useEffect } from 'react';
import { API_KEYS } from './config/api';

type View = 'main' | 'oil' | 'traffic';

type OilPrice = {
  prodcd: string;
  prodnm: string;
  price: string;
  diff: string;
};

type TrafficEvent = {
  type: string;
  roadName: string;
  location: string;
  message: string;
  startDate: string;
};

// 오늘의 기름값 컴포넌트
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
      
      console.log('유가 정보 API 호출 시작...');
      
      // Vercel 서버리스 함수 호출
      const response = await fetch('/api/opinet');
      
      console.log('응답 상태:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API 응답 데이터:', data);
      
      if (data.RESULT && data.RESULT.OIL && Array.isArray(data.RESULT.OIL)) {
        console.log('유가 정보:', data.RESULT.OIL);
        setOilPrices(data.RESULT.OIL);
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }
      
    } catch (err) {
      console.error('유가 정보 로드 오류:', err);
      setError(`실시간 데이터를 불러올 수 없습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
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
          <p className="mt-4 text-gray-400">실시간 데이터를 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
          <i className="fa-solid fa-exclamation-triangle mr-2"></i>
          {error}
          <button 
            onClick={fetchOilPrices} 
            className="mt-3 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full"
          >
            <i className="fa-solid fa-rotate mr-2"></i>
            다시 시도
          </button>
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
            자료출처: 한국석유공사 오피넷 (실시간 데이터)
          </div>
        </div>
      )}
    </div>
  );
};

// 도로 상황 컴포넌트
const TrafficView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [trafficEvents, setTrafficEvents] = useState<TrafficEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrafficInfo();
  }, []);

  const fetchTrafficInfo = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('도로 상황 API 호출 시작...');
      
      // Vercel 서버리스 함수 호출
      const response = await fetch('/api/traffic');
      
      console.log('응답 상태:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API 응답 데이터:', data);
      
      // API 응답 구조에 따라 파싱
      if (data.response && data.response.body && data.response.body.items) {
        const items = data.response.body.items.item || [];
        setTrafficEvents(items.map((item: any) => ({
          type: item.type || '정보없음',
          roadName: item.roadName || '도로명 정보 없음',
          location: item.location || '위치 정보 없음',
          message: item.message || '상세 정보 없음',
          startDate: item.startDate || ''
        })));
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }
      
    } catch (err) {
      console.error('도로 상황 로드 오류:', err);
      setError(`실시간 데이터를 불러올 수 없습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    if (type.includes('공사')) return 'fa-road-barrier';
    if (type.includes('사고')) return 'fa-car-burst';
    if (type.includes('통제')) return 'fa-ban';
    return 'fa-triangle-exclamation';
  };

  const getEventColor = (type: string) => {
    if (type.includes('공사')) return 'text-yellow-400';
    if (type.includes('사고')) return 'text-red-400';
    if (type.includes('통제')) return 'text-orange-400';
    return 'text-blue-400';
  };

  return (
    <div className="text-white w-full max-w-4xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
        <i className="fa-solid fa-road"></i>
        실시간 도로 상황
      </h2>

      {loading && (
        <div className="text-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-orange-400"></i>
          <p className="mt-4 text-gray-400">실시간 데이터를 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
          <i className="fa-solid fa-exclamation-triangle mr-2"></i>
          {error}
          <button 
            onClick={fetchTrafficInfo} 
            className="mt-3 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full"
          >
            <i className="fa-solid fa-rotate mr-2"></i>
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && trafficEvents.length > 0 && (
        <div className="space-y-4">
          {trafficEvents.map((event, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
              <div className="flex items-start gap-4">
                <i className={`fa-solid ${getEventIcon(event.type)} text-3xl ${getEventColor(event.type)} mt-1`}></i>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{event.roadName}</h3>
                    <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    <i className="fa-solid fa-location-dot mr-2"></i>
                    {event.location}
                  </p>
                  <p className="text-white">{event.message}</p>
                  {event.startDate && (
                    <p className="text-gray-500 text-xs mt-2">
                      <i className="fa-solid fa-clock mr-1"></i>
                      {event.startDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="text-center text-sm text-gray-500 mt-6">
            <i className="fa-solid fa-info-circle mr-2"></i>
            자료출처: 국토교통부 (실시간 데이터)
          </div>
        </div>
      )}

      {!loading && !error && trafficEvents.length === 0 && (
        <div className="bg-green-900/30 border border-green-500 text-green-300 p-6 rounded-lg text-center">
          <i className="fa-solid fa-check-circle text-4xl mb-4"></i>
          <h3 className="text-xl font-bold mb-2">원활한 도로 상황</h3>
          <p>현재 특이사항이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

// 메인 화면
const MainView: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const featureCards = [
    {
      type: 'nav',
      label: '확인하러 가기',
      backLabel: '오늘의 기름값',
      view: 'oil' as View,
      icon: 'fa-solid fa-gas-pump',
      theme: 'orange'
    },
    {
      type: 'nav',
      label: '확인하기',
      backLabel: '실시간 도로 상황',
      view: 'traffic' as View,
      icon: 'fa-solid fa-road',
      theme: 'indigo'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* 기능 섹션 */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <i className="fa-solid fa-compass mr-3"></i>
            실시간 정보
          </h2>
          <p className="text-gray-400 text-sm md:text-base">공공 API를 통한 실시간 데이터 제공</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 justify-items-center max-w-2xl mx-auto">
          {featureCards.map((card, index) => (
            <div 
              key={index} 
              className={`card ${card.theme} cursor-pointer`}
              onClick={() => onNavigate(card.view)}
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
    </div>
  );
};

// 메인 App 컴포넌트
const App: React.FC = () => {
  const [view, setView] = useState<View>('main');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as View;
      if (hash && ['oil', 'traffic'].includes(hash)) {
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
