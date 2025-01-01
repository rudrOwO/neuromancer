/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_URL: string
  readonly VITE_MODEL_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
