function checkFirstVisit() {
  if (typeof localStorage !== "undefined") {
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      localStorage.setItem("hasVisited", "true")
      return true
    }
    return false
  }
  return false // Fallback if localStorage is not available
}

export const isFirstVisit = checkFirstVisit()
