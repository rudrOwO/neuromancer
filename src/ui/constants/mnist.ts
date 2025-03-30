import { DEFAULT_GRAY_VALUE } from "@constants/global"
import type { InferenceResponse } from "bridge"

export const MODEL_URL = `${import.meta.env.VITE_PUBLIC_URL}/mnist-12.onnx`
export const INPUT_TENSOR_DIMENSION = [1, 1, 28, 28]
export const ORDERED_ACTIVATION_MAPS = [
  "Pooling66_Output_0",
  "Pooling160_Output_0",
]
export const FINAL_NODE = "Plus214_Output_0"
const ORDERED_ACTIVATION_MAPS_DIMENSIONS = [
  [1, 8, 14, 14],
  [1, 16, 4, 4],
]
export const DEFAULT_GRAY_VALUE = 0.07
export const ACTIVATION_MAPS_DEFAULT_VALUE: InferenceResponse = {
  isSuccessful: false,
  orderedActivationMaps: (function filler() {
    const activationMaps: Array<Float32Array> = []
    for (const dimension of ORDERED_ACTIVATION_MAPS_DIMENSIONS) {
      // 3 * for RGB
      const newArray = new Float32Array(3 * dimension.reduce((a, b) => a * b))
      newArray.fill(DEFAULT_GRAY_VALUE)
      activationMaps.push(newArray)
    }
    return activationMaps
  })(),
  predictions: Array(10).fill(0.1), // Probability of 1 distributed equally among 10 possibilities
}
export const INPUT_TENSOR_DEFAULT_VALUE = (function filler() {
  const newTensor = new Float32Array(
    3 * INPUT_TENSOR_DIMENSION.reduce((a, b) => a * b),
  )
  newTensor.fill(DEFAULT_GRAY_VALUE)
  return newTensor
})()
