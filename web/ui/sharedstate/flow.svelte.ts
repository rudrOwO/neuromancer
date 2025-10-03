import type { LayerName } from "@constants/mnist"
import { Vector3 } from "three"

export const tensorLocationMatrix: Record<LayerName, Array<Vector3>> = {
  "": [],
  Input: [],
  "Convolution Layer #1": [],
  "Max Pool #1": [],
  "Convolution Layer #2": [],
  "Max Pool #2": [],
}

let currentFlow: Array<[Vector3, Vector3]> = $state([
  [new Vector3(0, 0, 0), new Vector3(0, 0, 0)],
])

/**
why do we need getters and setters?
https://svelte.dev/docs/svelte/$state#Passing-state-across-modules
*/
export function getCurrentFlow() {
  return currentFlow
}

export function setCurrentFlow(
  layerName: LayerName,
  tensorIndex: number,
  end: Vector3,
) {
  switch (layerName) {
    case "Convolution Layer #1":
      currentFlow = tensorLocationMatrix["Input"].map((start) => [start, end])
      break
    case "Max Pool #1":
      currentFlow = [
        [tensorLocationMatrix["Convolution Layer #1"][tensorIndex], end],
      ]
      break
    case "Convolution Layer #2":
      currentFlow = tensorLocationMatrix["Max Pool #1"].map((start) => [
        start,
        end,
      ])
      break
    case "Max Pool #2":
      currentFlow = [
        [tensorLocationMatrix["Convolution Layer #2"][tensorIndex], end],
      ]
  }
}

export function clearCurrentFlow() {
  currentFlow = [[new Vector3(0, 0, 0), new Vector3(0, 0, 0)]]
}
