// why is this an object?
// https://svelte.dev/docs/svelte/$state#Passing-state-across-modules
export let infographicsModal: { element: HTMLDialogElement | null } = $state({
  element: null,
})

type Tensor = {
  tensorData: Float32Array
  rows: number
  columns: number
  size: number
}

type TensorState = { unmaskedTensors: Tensor[]; maskedTensors: Tensor[] }

export let tensorState: TensorState = $state({
  unmaskedTensors: [],
  maskedTensors: [],
})

type KernelState = {}

// TODO   export let kernelState : KernelState  = $state()

export function showModal() {
  infographicsModal.element?.showModal()
}

export function closeModal() {
  infographicsModal.element?.close()
}
