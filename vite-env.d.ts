/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPINET_API_KEY?: string;
  readonly VITE_DATA_GO_KR_API_KEY?: string;
  readonly GEMINI_API_KEY?: string;
  // 더 많은 환경 변수를 여기에 추가...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
