/**
 * API 키 설정 파일
 * 
 * 이 파일은 프로젝트에서 사용하는 모든 API 키를 관리합니다.
 * 실제 배포 시에는 환경변수(.env.local)를 통해 관리됩니다.
 */

// 환경 변수 안전하게 가져오기
const getEnvVar = (key: keyof ImportMetaEnv, defaultValue: string): string => {
  if (typeof import.meta.env !== 'undefined' && import.meta.env[key]) {
    return import.meta.env[key] as string;
  }
  return defaultValue;
};

export const API_KEYS = {
  // 한국석유공사 오피넷 API
  OPINET: getEnvVar('VITE_OPINET_API_KEY', 'F251104981'),
  
  // 공공데이터포털 API (공통 키)
  DATA_GO_KR: getEnvVar('VITE_DATA_GO_KR_API_KEY', '440b7e60c6b66d63a729eb1f3bba1e874e932953b50572fb21f1ce0c28342fc9'),
  
  // 국토교통부 실시간 주요 도로 상황 API
  MOLIT_TRAFFIC: getEnvVar('VITE_MOLIT_TRAFFIC_API_KEY', '67489c096aa949e0bd1c2e771ca6475b'),
} as const;

/**
 * API 엔드포인트 설정
 */
export const API_ENDPOINTS = {
  // 오피넷 API
  OPINET: {
    AVG_ALL_PRICE: 'https://www.opinet.co.kr/api/avgAllPrice.do',
    AROUND_ALL: 'https://www.opinet.co.kr/api/aroundAll.do',
  },
  
  // 국토교통부 실시간 도로 소통 정보 API
  MOLIT_TRAFFIC: {
    BASE_URL: 'http://data.ex.co.kr/api/trafficapi/trafficInfo',
  },
} as const;

/**
 * CORS 프록시 설정
 */
export const CORS_PROXY = 'https://api.allorigins.win/get?url=';

/**
 * API 호출 헬퍼 함수
 */
export const buildApiUrl = (endpoint: string, params: Record<string, string | number>) => {
  const url = new URL(endpoint);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  return url.toString();
};

export default API_KEYS;
