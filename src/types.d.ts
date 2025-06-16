import type { InteractivityProps } from "@threlte/extras"

declare global {
  namespace Threlte {
    interface UserProps extends InteractivityProps {}
  }
}

export {}
