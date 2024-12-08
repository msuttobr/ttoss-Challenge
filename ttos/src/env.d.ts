/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_KEY: string;
  VITE_BASE_API: string;
  VITE_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}