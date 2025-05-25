import { isFirstVisit } from "@utils/firstvisit"

let showHint = $state(isFirstVisit)
let isPointerDragging = $state(false)
let timeoutId: any
const tinyDragDuration = 100

// why thsese trivial functions?
// https://svelte.dev/docs/svelte/$state#Passing-state-across-modules
export function isShowHint() {
  return showHint
}

export function isDraggingFinished() {
  return !isPointerDragging
}

export function handlePointerDown() {
  showHint = false
  // why use timeout?
  // to still register tiny drags as clicks
  timeoutId = setTimeout(() => (isPointerDragging = true), tinyDragDuration)
}

export function handlePointerRelease() {
  clearTimeout(timeoutId)
  setTimeout(() => (isPointerDragging = false), tinyDragDuration)
}
