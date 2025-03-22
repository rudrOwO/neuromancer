import type { InferenceResponse } from "bridge"

export const MODEL_URL = `${import.meta.env.VITE_PUBLIC_URL}/mnist-12.onnx`
export const INPUT_TENSOR_DIMENSION = [1, 1, 28, 28]
export const ORDERED_ACTIVATION_MAPS = [
  "Pooling66_Output_0",
  "Pooling160_Output_0",
]
export const ORDERED_ACTIVATION_MAPS_DIMENSIONS = [
  [1, 8, 14, 14],
  [1, 16, 4, 4],
]
export const FINAL_NODE = "Plus214_Output_0"
export const ACTIVATION_MAPS_DEFAULT_VALUE: InferenceResponse = {
  isSuccessful: false,
  orderedActivationMaps: ORDERED_ACTIVATION_MAPS_DIMENSIONS.map(
    (dim) => new Float32Array(dim.reduce((a, b) => a * b)),
  ),

  predictions: Array(10).fill(0.1),
}
export const INPUT_TENSOR_DEFAULT_VALUE =  new Float32Array(INPUT_TENSOR_DIMENSION.reduce((a, b) => a * b))
