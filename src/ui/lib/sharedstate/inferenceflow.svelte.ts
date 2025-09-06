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
why these trivial getters and setters?
https://svelte.dev/docs/svelte/$state#Passing-state-across-modules
*/
export function getCurrentFlow() {
  return currentFlow
}

export function setCurrentFlow(flow: Array<[Vector3, Vector3]>) {
  currentFlow = flow
}

export function clearCurrentFlow() {
  currentFlow = [[new Vector3(0, 0, 0), new Vector3(0, 0, 0)]]
}
