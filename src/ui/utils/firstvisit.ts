function checkFirstVisit() {
  if (typeof localStorage !== "undefined") {
    const hasVisited = localStorage.getItem("hasVisited_v1.0.4")
    if (!hasVisited) {
      localStorage.setItem("hasVisited_v1.0.4", "true")
      return true
    }
    return false
  }
  return false // Fallback if localStorage is not available
}

export const isFirstVisit = checkFirstVisit()
