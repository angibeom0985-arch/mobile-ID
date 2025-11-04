# API Keys Documentation

## 현재 사용 중인 API 키

### 1. 한국석유공사 오피넷 (OPINET)
- **API 키**: `F251104981`
- **용도**: 
  - 전국 평균 유류 가격 조회
  - 주변 주유소 검색
- **문서**: https://www.opinet.co.kr/user/openapiinfo/apidoc.do

### 2. 공공데이터포털 (data.go.kr)
- **API 키**: `440b7e60c6b66d63a729eb1f3bba1e874e932953b50572fb21f1ce0c28342fc9`
- **용도**:
  - 생활기상지수 (세차 지수)
  - 생활기상지수 (건강 지수 - 감기, 식중독, 천식)
  - 대기오염 정보 (미세먼지, 초미세먼지)
  - 전국 공영주차장 정보
- **문서**: https://www.data.go.kr/

## API 키 관리 방법

### 환경변수 설정
`.env.local` 파일에 다음과 같이 설정:

```bash
VITE_OPINET_API_KEY=F251104981
VITE_DATA_GO_KR_API_KEY=440b7e60c6b66d63a729eb1f3bba1e874e932953b50572fb21f1ce0c28342fc9
```

### 코드에서 사용
`config/api.ts` 파일을 import하여 사용:

```typescript
import { API_KEYS, API_ENDPOINTS, CORS_PROXY } from './config/api';

// 예시: 기름값 조회
const url = `${CORS_PROXY}${encodeURIComponent(
  `${API_ENDPOINTS.OPINET.AVG_ALL_PRICE}?code=${API_KEYS.OPINET}&out=json`
)}`;
```

## API 사용량 및 제한

### 오피넷 API
- 제한: 일일 1,000회
- 현재 사용: 오늘의 기름값, 내 주변 주유소 (2개 엔드포인트)

### 공공데이터포털 API
- 제한: 일일 1,000회 (각 API별)
- 현재 사용: 4개 서비스

## 보안 주의사항

1. **절대 GitHub에 커밋하지 말 것**
   - `.env.local` 파일은 `.gitignore`에 포함됨
   - API 키는 환경변수로만 관리

2. **프로덕션 환경**
   - Vercel 환경변수에 설정
   - Settings → Environment Variables

3. **키 교체 시**
   - `.env.local` 파일 업데이트
   - Vercel 환경변수 업데이트
   - 애플리케이션 재배포

## 문제 해결

### API 호출 실패 시
1. API 키 유효성 확인
2. CORS 프록시 상태 확인 (`corsproxy.io`)
3. API 서비스 상태 확인 (공공데이터포털/오피넷)
4. 일일 사용량 제한 확인

### 키 갱신 필요 시
1. 공공데이터포털 (data.go.kr) 접속
2. 마이페이지 → 오픈API → 인증키 확인
3. 오피넷 (www.opinet.co.kr) 접속
4. 오픈API → 인증키 발급

## 마지막 업데이트
- 날짜: 2025년 11월 5일
- 작성자: System
- 버전: 1.0
