export function getArrowSourceCoordinates(
  el: HTMLDivElement | HTMLImageElement,
  parent: HTMLDivElement,
) {
  const rect = el.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  return {
    x: rect.right - parentRect.left,
    y: rect.top - parentRect.top + rect.height / 2,
  }
}

export function getArrowTargetCoordinates(
  el: HTMLDivElement | HTMLImageElement,
  parent: HTMLDivElement,
) {
  const rect = el.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  return {
    x: rect.left - parentRect.left,
    y: rect.top - parentRect.top + rect.height / 2,
  }
}
