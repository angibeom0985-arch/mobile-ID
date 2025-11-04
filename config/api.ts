/**
 * API 키 설정 파일
 * 
 * 이 파일은 프로젝트에서 사용하는 모든 API 키를 관리합니다.
 * 실제 배포 시에는 환경변수(.env.local)를 통해 관리됩니다.
 */

export const API_KEYS = {
  // 한국석유공사 오피넷 API
  OPINET: import.meta.env.VITE_OPINET_API_KEY || 'F251104981',
  
  // 공공데이터포털 API (공통 키)
  DATA_GO_KR: import.meta.env.VITE_DATA_GO_KR_API_KEY || '440b7e60c6b66d63a729eb1f3bba1e874e932953b50572fb21f1ce0c28342fc9',
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
  
  // 기상청 API
  WEATHER: {
    CAR_WASH_IDX: 'https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getCarWashIdx',
    WTHR_WRNNG_IDX: 'https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getWthrWrnngIdx',
  },
  
  // 환경부 대기오염 정보 API
  AIR_QUALITY: {
    CTPRVN_RLTM_MESURE_DNSTY: 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty',
  },
  
  // 주차장 정보 API
  PARKING: {
    ODCLOUD: 'https://api.odcloud.kr/api/15050093/v1/uddi:41944402-8249-4e45-9e9d-a52d0a7db1cc',
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
