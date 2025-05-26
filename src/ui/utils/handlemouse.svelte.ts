import { isFirstVisit } from "@utils/firstvisit"

let showHint = $state(isFirstVisit)
let isPointerDragging = $state(false)
let timeoutId: any
const delay = 100

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
  // using delay to prevent race condition with click handler
  timeoutId = setTimeout(() => (isPointerDragging = true), delay)
}

export function handlePointerRelease() {
  clearTimeout(timeoutId)
  // using delay to allow the click handler to finish executing with correct state (isPointerDragging)
  setTimeout(() => (isPointerDragging = false), delay)
}
