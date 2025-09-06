import { SVG_STROKE_DASH_ARRAY, SVG_STROKE_WIDTH } from "@constants/graphics"

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
  const svgViewBox = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  )
  svgViewBox.setAttribute("width", "100%")
  svgViewBox.setAttribute("height", "100%")
  parent.appendChild(svgViewBox)

  return function drawArrow(source: HTMLElement, target: HTMLElement) {
    const sourceCoordinates = getArrowSourceCoordinates(source, parent)
    const targetCoordinates = getArrowTargetCoordinates(target, parent)

    const newArrow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    )
    newArrow.setAttribute("stroke-width", SVG_STROKE_WIDTH)
    newArrow.setAttribute("stroke-dasharray", SVG_STROKE_DASH_ARRAY)
    newArrow.setAttribute("x1", sourceCoordinates.x.toString())
    newArrow.setAttribute("y1", sourceCoordinates.y.toString())
    newArrow.setAttribute("x2", targetCoordinates.x.toString())
    newArrow.setAttribute("y2", targetCoordinates.y.toString())
    svgViewBox.appendChild(newArrow)

    return newArrow
  }
}
