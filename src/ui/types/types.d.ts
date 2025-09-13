import type { InteractivityProps } from "@threlte/extras"

declare global {
  namespace Threlte {
    interface UserProps extends InteractivityProps {}
  }

  // Vite injected build-time constants
  const __APP_VERSION__: string
}

export {}
