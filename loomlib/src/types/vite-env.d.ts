/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOOMLIB_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
