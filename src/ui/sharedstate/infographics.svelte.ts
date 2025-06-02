// why is this an object?

import type { LayerName } from "@constants/mnist"

// https://svelte.dev/docs/svelte/$state#Passing-state-across-modules
type InfoGraphicsModal = {
  element: HTMLDialogElement | null
  layerName: LayerName
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
}

type TensorState = {
  unmaskedTensors: Tensor[]
  maskedTensor: Pick<
    Tensor,
    | "tensorData"
    | "rows"
    | "columns"
    | "cellSize"
    | "kernelStride"
    | "kernelDimension"
  > | null
}

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
