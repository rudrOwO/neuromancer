// why is this an object?
// https://svelte.dev/docs/svelte/$state#Passing-state-across-modules
export let infographicsModal: { element: HTMLDialogElement | null } = $state({
  element: null,
})

export function showModal() {
  infographicsModal.element?.showModal()
}

export function closeModal() {
  infographicsModal.element?.close()
}
