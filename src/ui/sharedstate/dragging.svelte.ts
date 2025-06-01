// why is this an object?
// https://svelte.dev/docs/svelte/$state#Passing-state-across-modules
export let pointerDraggingState = $state({
  isDragging: false,
})
