import { SVG } from "@svgdotjs/svg.js"

function getArrowSourceCoordinates(el: HTMLElement, parent: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  return {
    x: rect.right - parentRect.left,
    y: rect.top - parentRect.top + rect.height / 2,
  }
}

function getArrowTargetCoordinates(el: HTMLElement, parent: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  return {
    x: rect.left - parentRect.left,
    y: rect.top - parentRect.top + rect.height / 2,
  }
}

export function initializeSVG(parent: HTMLElement) {
  const draw = SVG().addTo(parent).size("100%", "100%")

  return function drawArrow(source: HTMLElement, target: HTMLElement) {
    const sourceCoordinates = getArrowSourceCoordinates(source, parent)
    const targetCoordinates = getArrowTargetCoordinates(target, parent)

    return draw
      .line(
        sourceCoordinates.x,
        sourceCoordinates.y,
        targetCoordinates.x,
        targetCoordinates.y,
      )
      .stroke({ width: 2, dasharray: "10" })
  }
}
