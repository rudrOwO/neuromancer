const mediaQuery = window.matchMedia("(min-width: 1280px)")

let _isDesktop = $state(mediaQuery.matches)

mediaQuery.addEventListener("change", (ev: MediaQueryListEvent) => {
  _isDesktop = ev.matches
})

export function isDesktop() {
  return _isDesktop
}
