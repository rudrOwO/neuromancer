export const mediaQuery = window.matchMedia("(min-width: 1280px)")

export const checkIfDesktop = (event: MediaQueryListEvent) => {
  return event.matches
}
