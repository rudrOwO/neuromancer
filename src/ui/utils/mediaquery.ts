export const mobileMediaQuery = window.matchMedia("(max-width: 768px)")

export const checkIfMobile = (event: MediaQueryListEvent) => {
  return event.matches
}
