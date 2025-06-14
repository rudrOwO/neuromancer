// why is this an object?
// https://svelte.dev/docs/svelte/$state#Passing-state-across-modules
type InfoGraphicsModal = {
  element: HTMLDialogElement | null
  layerName: string
  isOpen: boolean
}

export let infographicsModal: InfoGraphicsModal = $state({
  element: null,
  layerName: "",
  isOpen: false,
})

export type Tensor = {
  tensorData: Float32Array
  rows: number
  columns: number
  cellSize: number
  kernelStride: number
  kernelDimension: number
  kernelTick: number
  masked: boolean
}

type TensorState = { unmaskedTensors: Tensor[]; maskedTensor: Tensor | null }

export let tensorState: TensorState = $state({
  unmaskedTensors: [],
  maskedTensor: null,
})

export function showModal() {
  infographicsModal.isOpen = true
  infographicsModal.element?.showModal()
}

export function closeModal() {
  infographicsModal.isOpen = false
  infographicsModal.element?.close()
}
