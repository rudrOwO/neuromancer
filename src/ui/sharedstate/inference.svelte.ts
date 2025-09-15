import { ACTIVATION_MAPS_DEFAULT_VALUE } from "@constants/mnist"
import type { InferenceResponse } from "bridge"

let inferenceResponse = $state<InferenceResponse>(ACTIVATION_MAPS_DEFAULT_VALUE)

/**
why these trivial getters and setters?
https://svelte.dev/docs/svelte/$state#Passing-state-across-modules
*/

export function getInferenceResponse() {
  return inferenceResponse
}

export function setInferenceResponse(_inferenceResponse: InferenceResponse) {
  inferenceResponse = _inferenceResponse
}
