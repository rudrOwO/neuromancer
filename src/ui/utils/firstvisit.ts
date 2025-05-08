export function checkFirstVisit() {
  if (typeof localStorage !== "undefined") {
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      localStorage.setItem("hasVisited", "true")
      return true // It's the first visit
    }
    return false // Not the first visit
  }
  return false // Fallback if localStorage is not available
}
