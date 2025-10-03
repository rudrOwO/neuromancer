/// <reference types="svelte" />
/// <reference types="vite/client" />

// Add environment variable types here
interface ImportMetaEnv {
  // readonly VITE_EXAMPLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
