import React, { useState, useEffect } from 'react';

type View = 'main' | 'oil' | 'station' | 'weather' | 'health' | 'parking' | 'report';

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

type WeatherInfo = {
  carWash: { level: string; comment: string };
  airQuality: { pm10: string; pm25: string; status: string };
  warning: string;
};

type HealthInfo = {
  cold: { level: string; icon: string };
  food: { level: string; icon: string };
  asthma: { level: string; icon: string };
};

type ParkingLot = {
  prkplceNo: string;
  prkplceNm: string;
  prkcmprt: string;
  curPrkCnt: string;
  address: string;
  latitude: string;
  longitude: string;
};

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
      
      // CORS 우회를 위한 프록시 사용
      const proxyUrl = 'https://corsproxy.io/?';
      const apiUrl = encodeURIComponent('https://www.opinet.co.kr/api/avgAllPrice.do?code=F251104981&out=json');
      
      const response = await fetch(proxyUrl + apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }
      
      const data = await response.json();
      
      if (data.RESULT && data.RESULT.OIL) {
        setOilPrices(data.RESULT.OIL);
      } else {
        setError('유가 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
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

      {!loading && !error && (
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

const GasStationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setLocationPermission(result.state as 'prompt' | 'granted' | 'denied');
        if (result.state === 'granted') {
          getUserLocation();
        } else if (result.state === 'prompt') {
          setLoading(false);
        } else {
          setError('위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.');
          setLoading(false);
        }
      } catch {
        getUserLocation();
      }
    } else {
      getUserLocation();
    }
  };

  const requestLocation = () => {
    setLoading(true);
    setError('');
    getUserLocation();
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLocationPermission('granted');
          fetchNearbyStations(location.lat, location.lng);
        },
        (error) => {
          setLocationPermission('denied');
          if (error.code === error.PERMISSION_DENIED) {
            setError('위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.');
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setError('위치 정보를 사용할 수 없습니다. GPS가 활성화되어 있는지 확인해주세요.');
          } else {
            setError('위치 정보를 가져오는 중 오류가 발생했습니다.');
          }
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
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
      
      const proxyUrl = 'https://corsproxy.io/?';
      const apiUrl = encodeURIComponent(
        `https://www.opinet.co.kr/api/aroundAll.do?code=F251104981&x=${lng}&y=${lat}&radius=5000&sort=1&prodcd=B027&out=json`
      );
      
      const response = await fetch(proxyUrl + apiUrl);
      
      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }
      
      const data = await response.json();
      
      if (data.RESULT && data.RESULT.OIL) {
        setStations(data.RESULT.OIL);
      } else {
        setError('주변 주유소 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
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

const WeatherView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          fetchWeatherData(location.lat, location.lng);
        },
        (error) => {
          setError('위치 정보를 가져올 수 없습니다.');
          setLoading(false);
        }
      );
    } else {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      setError('');
      
      const proxyUrl = 'https://corsproxy.io/?';
      
      // 기상청 API 호출 (세차 지수)
      const carWashUrl = encodeURIComponent(
        `https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getCarWashIdx?serviceKey=440b7e60c6b66d63a729eb1f3bba1e874e932953b50572fb21f1ce0c28342fc9&numOfRows=10&pageNo=1&dataType=JSON&areaNo=1100000000`
      );
      const carWashResponse = await fetch(proxyUrl + carWashUrl);
      const carWashData = await carWashResponse.json();
      
      // 대기오염 정보 API 호출
      const airUrl = encodeURIComponent(
        `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=440b7e60c6b66d63a729eb1f3bba1e874e932953b50572fb21f1ce0c28342fc9&returnType=json&numOfRows=1&pageNo=1&sidoName=서울&ver=1.0`
      );
      const airResponse = await fetch(proxyUrl + airUrl);
      const airData = await airResponse.json();

      // 데이터 파싱
      const carWashItem = carWashData.response?.body?.items?.item?.[0];
      const airItem = airData.response?.body?.items?.[0];

      setWeather({
        carWash: {
          level: carWashItem?.h0 || '보통',
          comment: getCarWashComment(carWashItem?.h0 || '보통')
        },
        airQuality: {
          pm10: airItem?.pm10Value || '-',
          pm25: airItem?.pm25Value || '-',
          status: airItem?.pm10Grade || '보통'
        },
        warning: '현재 특보가 없습니다.'
      });
    } catch (err) {
      setError('날씨 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const getCarWashComment = (level: string) => {
    if (level.includes('좋음') || level.includes('최적')) return '오늘 세차하기 좋은 날입니다!';
    if (level.includes('나쁨')) return '오후 비 예보, 세차 비추천';
    return '세차 가능한 날씨입니다.';
  };

  const getAirQualityStatus = (grade: string) => {
    if (grade === '1' || grade.includes('좋음')) return { text: '좋음', color: 'text-blue-400' };
    if (grade === '2' || grade.includes('보통')) return { text: '보통', color: 'text-green-400' };
    if (grade === '3' || grade.includes('나쁨')) return { text: '나쁨', color: 'text-orange-400' };
    if (grade === '4' || grade.includes('매우')) return { text: '매우 나쁨', color: 'text-red-400' };
    return { text: '보통', color: 'text-gray-400' };
  };

  return (
    <div className="text-white w-full max-w-4xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
        <i className="fa-solid fa-cloud-sun"></i>
        오늘 세차 날씨
      </h2>

      {loading && (
        <div className="text-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-cyan-400"></i>
          <p className="mt-4 text-gray-400">날씨 정보를 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
          <i className="fa-solid fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {!loading && !error && weather && (
        <div className="space-y-6">
          {/* 세차 지수 */}
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 p-6 rounded-lg border border-cyan-500/30">
            <div className="flex items-center gap-4 mb-4">
              <i className="fa-solid fa-car text-4xl text-cyan-400"></i>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">세차 지수</h3>
                <p className="text-cyan-300 text-lg mt-1">{weather.carWash.comment}</p>
              </div>
            </div>
          </div>

          {/* 대기질 정보 */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-wind"></i>
              대기질 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-md">
                <p className="text-sm text-gray-400 mb-2">미세먼지 (PM10)</p>
                <p className={`text-2xl font-bold ${getAirQualityStatus(weather.airQuality.status).color}`}>
                  {weather.airQuality.pm10} μg/m³
                </p>
                <p className="text-sm text-gray-400 mt-1">{getAirQualityStatus(weather.airQuality.status).text}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-md">
                <p className="text-sm text-gray-400 mb-2">초미세먼지 (PM2.5)</p>
                <p className="text-2xl font-bold text-orange-400">{weather.airQuality.pm25} μg/m³</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-900/30 rounded-md">
              <p className="text-sm">
                <i className="fa-solid fa-lightbulb mr-2 text-yellow-400"></i>
                차량 내부 공기 순환 모드를 사용하세요
              </p>
            </div>
          </div>

          {/* 기상 특보 */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i>
              기상 특보
            </h3>
            <p className="text-gray-300">{weather.warning}</p>
          </div>

          <div className="text-center text-sm text-gray-500 mt-6">
            <i className="fa-solid fa-info-circle mr-2"></i>
            자료출처: 기상청, 한국환경공단
          </div>
        </div>
      )}
    </div>
  );
};

const HealthView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const proxyUrl = 'https://corsproxy.io/?';
      const apiUrl = encodeURIComponent(
        `https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getWthrWrnngIdx?serviceKey=440b7e60c6b66d63a729eb1f3bba1e874e932953b50572fb21f1ce0c28342fc9&numOfRows=10&pageNo=1&dataType=JSON&areaNo=1100000000`
      );
      
      const response = await fetch(proxyUrl + apiUrl);
      const data = await response.json();
      
      const items = data.response?.body?.items?.item || [];
      
      setHealth({
        cold: {
          level: items[0]?.h0 || '관심',
          icon: '🤧'
        },
        food: {
          level: items[1]?.h0 || '관심',
          icon: '🤢'
        },
        asthma: {
          level: items[2]?.h0 || '관심',
          icon: '😮‍💨'
        }
      });
    } catch (err) {
      setError('건강 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const getHealthAdvice = (type: string, level: string) => {
    if (type === 'cold') {
      if (level.includes('경고')) return '외출 시 외투 필수, 손씻기 철저히';
      if (level.includes('주의')) return '외투 챙기세요, 일교차 조심';
      return '평소처럼 생활하세요';
    }
    if (type === 'food') {
      if (level.includes('경고')) return '음식물 보관 각별히 주의, 익혀 드세요';
      if (level.includes('주의')) return '음식 조심하세요, 보관 신경쓰기';
      return '일반적인 주의만 필요합니다';
    }
    if (type === 'asthma') {
      if (level.includes('경고')) return '외출 자제, 약 미리 준비하세요';
      if (level.includes('주의')) return '마스크 착용 권장, 환기 시간 조정';
      return '실내 환기 적절히 하세요';
    }
    return '관심';
  };

  const getLevelColor = (level: string) => {
    if (level.includes('경고')) return 'border-red-500 bg-red-900/20';
    if (level.includes('주의')) return 'border-orange-500 bg-orange-900/20';
    return 'border-green-500 bg-green-900/20';
  };

  const getLevelBadge = (level: string) => {
    if (level.includes('경고')) return { text: '경고', color: 'bg-red-600' };
    if (level.includes('주의')) return { text: '주의', color: 'bg-orange-600' };
    return { text: '관심', color: 'bg-green-600' };
  };

  return (
    <div className="text-white w-full max-w-4xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
        <i className="fa-solid fa-heart-pulse"></i>
        오늘의 건강 지수
      </h2>

      {loading && (
        <div className="text-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-pink-400"></i>
          <p className="mt-4 text-gray-400">건강 정보를 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
          <i className="fa-solid fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {!loading && !error && health && (
        <div className="space-y-6">
          {/* 감기 */}
          <div className={`p-6 rounded-lg border-2 ${getLevelColor(health.cold.level)}`}>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{health.cold.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">감기</h3>
                  <span className={`${getLevelBadge(health.cold.level).color} text-white text-sm px-3 py-1 rounded-full`}>
                    {getLevelBadge(health.cold.level).text}
                  </span>
                </div>
                <p className="text-gray-300 text-lg">{getHealthAdvice('cold', health.cold.level)}</p>
              </div>
            </div>
          </div>

          {/* 식중독 */}
          <div className={`p-6 rounded-lg border-2 ${getLevelColor(health.food.level)}`}>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{health.food.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">식중독</h3>
                  <span className={`${getLevelBadge(health.food.level).color} text-white text-sm px-3 py-1 rounded-full`}>
                    {getLevelBadge(health.food.level).text}
                  </span>
                </div>
                <p className="text-gray-300 text-lg">{getHealthAdvice('food', health.food.level)}</p>
              </div>
            </div>
          </div>

          {/* 천식 */}
          <div className={`p-6 rounded-lg border-2 ${getLevelColor(health.asthma.level)}`}>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{health.asthma.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">천식·폐질환</h3>
                  <span className={`${getLevelBadge(health.asthma.level).color} text-white text-sm px-3 py-1 rounded-full`}>
                    {getLevelBadge(health.asthma.level).text}
                  </span>
                </div>
                <p className="text-gray-300 text-lg">{getHealthAdvice('asthma', health.asthma.level)}</p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-6">
            <i className="fa-solid fa-info-circle mr-2"></i>
            자료출처: 기상청 생활기상지수
          </div>
        </div>
      )}
    </div>
  );
};

const ParkingView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showRegionModal, setShowRegionModal] = useState(false);

  const regions = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

  useEffect(() => {
    const savedRegion = localStorage.getItem('preferredRegion');
    if (savedRegion) {
      setSelectedRegion(savedRegion);
    } else {
      setSelectedRegion('서울');
      setShowRegionModal(true);
    }
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      fetchParkingLots();
    }
  }, [selectedRegion]);

  const fetchParkingLots = async () => {
    try {
      setLoading(true);
      setError('');
      
      const proxyUrl = 'https://corsproxy.io/?';
      const serviceKey = '440b7e60c6b66d63a729eb1f3bba1e874e932953b50572fb21f1ce0c28342fc9';
      const apiUrl = encodeURIComponent(
        `https://api.odcloud.kr/api/15050093/v1/uddi:41944402-8249-4e45-9e9d-a52d0a7db1cc?page=1&perPage=50&serviceKey=${serviceKey}&returnType=JSON`
      );
      
      const response = await fetch(proxyUrl + apiUrl);

      if (!response.ok) {
        throw new Error('주차장 정보를 가져올 수 없습니다.');
      }

      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        const filteredData = data.data
          .filter((lot: any) => lot.prkplceNm && lot.prkplceNm.includes(selectedRegion))
          .map((lot: any) => ({
            prkplceNo: lot.prkplceNo || '',
            prkplceNm: lot.prkplceNm || '정보 없음',
            prkcmprt: lot.prkcmprt || '0',
            curPrkCnt: lot.curPrkCnt || '0',
            address: lot.rdnmadr || lot.lnmadr || '주소 정보 없음',
            latitude: lot.latitude || '0',
            longitude: lot.longitude || '0'
          }));
        
        setParkingLots(filteredData.slice(0, 20));
      } else {
        setParkingLots([]);
      }
    } catch (err) {
      setError('주차장 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    localStorage.setItem('preferredRegion', region);
    setShowRegionModal(false);
  };

  const getAvailabilityStatus = (current: string, total: string) => {
    const curr = parseInt(current) || 0;
    const tot = parseInt(total) || 0;
    const available = tot - curr;
    const ratio = tot > 0 ? available / tot : 0;

    if (ratio >= 0.3) return { color: 'text-green-400', text: '여유', icon: '✓' };
    if (ratio >= 0.1) return { color: 'text-yellow-400', text: '보통', icon: '!' };
    return { color: 'text-red-400', text: '혼잡', icon: '✗' };
  };

  return (
    <div className="text-white w-full max-w-2xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
      </button>

      {showRegionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">관심 지역 설정</h3>
            <p className="text-gray-400 mb-4">주차장 정보를 확인할 지역을 선택해주세요.</p>
            <div className="grid grid-cols-3 gap-2">
              {regions.map(region => (
                <button
                  key={region}
                  onClick={() => handleRegionChange(region)}
                  className="bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            <i className="fa-solid fa-square-parking mr-3"></i>
            실시간 주차장 정보
          </h2>
          <button
            onClick={() => setShowRegionModal(true)}
            className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
          >
            <i className="fa-solid fa-location-dot mr-2"></i>
            {selectedRegion}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <i className="fa-solid fa-spinner fa-spin text-4xl mb-4"></i>
            <p className="text-gray-300">주차장 정보를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 text-center">
            <i className="fa-solid fa-exclamation-triangle text-3xl mb-3 text-red-400"></i>
            <p className="text-red-300">{error}</p>
          </div>
        ) : parkingLots.length === 0 ? (
          <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-6 text-center">
            <i className="fa-solid fa-info-circle text-3xl mb-3 text-yellow-400"></i>
            <p className="text-yellow-300">{selectedRegion} 지역의 주차장 정보가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {parkingLots.map((lot, index) => {
              const available = parseInt(lot.prkcmprt) - parseInt(lot.curPrkCnt);
              const status = getAvailabilityStatus(lot.curPrkCnt, lot.prkcmprt);
              
              return (
                <div key={lot.prkplceNo || index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 hover:border-purple-400 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        <i className="fa-solid fa-parking text-purple-400 mr-2"></i>
                        {lot.prkplceNm}
                      </h3>
                      <p className="text-sm text-gray-400">
                        <i className="fa-solid fa-location-dot mr-1"></i>
                        {lot.address}
                      </p>
                    </div>
                    <div className={`text-right ${status.color}`}>
                      <div className="text-2xl font-bold">{status.icon}</div>
                      <div className="text-sm font-semibold">{status.text}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">잔여:</span>
                      <span className="text-xl font-bold text-blue-400">{available}</span>
                      <span className="text-gray-500">/ {lot.prkcmprt}대</span>
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full ${status.color.replace('text-', 'bg-')} transition-all`}
                        style={{ width: `${Math.min(100, (available / parseInt(lot.prkcmprt)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center text-sm text-gray-400 mt-6">
          <i className="fa-solid fa-info-circle mr-2"></i>
          자료출처: 한국교통안전공단 전국공영주차장정보
        </div>
      </div>
    </div>
  );
};

const SuggestionView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [suggestionType, setSuggestionType] = useState('UI/UX 개선');
  const [suggestionDetails, setSuggestionDetails] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{type: string, details: string, timestamp: string}>>([]);

  const handleSubmit = () => {
    if (suggestionDetails.trim()) {
      const newSuggestion = {
        type: suggestionType,
        details: suggestionDetails,
        timestamp: new Date().toLocaleString('ko-KR')
      };
      setSuggestions([newSuggestion, ...suggestions]);
      setSuggestionDetails('');
    }
  };

  return (
    <div className="text-white w-full max-w-2xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
      </button>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">새로운 기능 제안</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="suggestion-type" className="block text-lg font-medium mb-2">건의 종류</label>
            <select 
              id="suggestion-type" 
              value={suggestionType}
              onChange={(e) => setSuggestionType(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
            >
              <option>UI/UX 개선</option>
              <option>신규 기능 추가</option>
              <option>오류 신고</option>
              <option>기타</option>
            </select>
          </div>
          <div>
            <label htmlFor="suggestion-details" className="block text-lg font-medium mb-2">상세 내용</label>
            <textarea 
              id="suggestion-details" 
              value={suggestionDetails}
              onChange={(e) => setSuggestionDetails(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none" 
              rows={5} 
              placeholder="앱을 더 발전시킬 수 있는 아이디어를 자유롭게 작성해주세요."
            ></textarea>
          </div>
          <button 
            type="button" 
            onClick={handleSubmit}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            제안 제출하기
          </button>
        </form>
      </div>

      {/* 제안 목록 */}
      {suggestions.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-2xl font-bold mb-4">제출된 제안</h3>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-pink-600 text-white text-sm px-3 py-1 rounded-full">{suggestion.type}</span>
                <span className="text-gray-400 text-sm">{suggestion.timestamp}</span>
              </div>
              <p className="text-white mt-2">{suggestion.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



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
      backLabel: '세차 날씨 정보',
      view: 'weather',
      icon: 'fa-solid fa-cloud-sun',
      theme: 'cyan'
    },
    {
      type: 'nav',
      label: '확인하기',
      backLabel: '건강 지수',
      view: 'health',
      icon: 'fa-solid fa-heart-pulse',
      theme: 'rose'
    },
    {
      type: 'nav',
      label: '찾아보기',
      backLabel: '실시간 주차장',
      view: 'parking',
      icon: 'fa-solid fa-square-parking',
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
          <p className="text-gray-400 text-sm md:text-base">다양한 정보를 한눈에 확인하세요</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 justify-items-center">
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

      {/* 새로운 기능 제안 버튼 */}
      <section className="text-center">
        <button
          onClick={() => onNavigate('report')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          <i className="fa-solid fa-lightbulb mr-3 text-xl"></i>
          <span className="text-lg">새로운 기능 제안하기</span>
        </button>
        <p className="text-gray-500 text-sm mt-4">더 나은 서비스를 위한 여러분의 의견을 들려주세요</p>
      </section>
    </div>
  );
};


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
      case 'weather':
        return <WeatherView onBack={goBack} />;
      case 'health':
        return <HealthView onBack={goBack} />;
      case 'parking':
        return <ParkingView onBack={goBack} />;
      case 'report':
        return <SuggestionView onBack={goBack} />;
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