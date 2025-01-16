export const MODEL_URL = `${import.meta.env.VITE_PUBLIC_URL}/mnist-12.onnx`
export const INPUT_TENSOR_DIMENSION = [1, 1, 28, 28]
export const ORDERED_OUTPUT_NODES = [
  "Pooling66_Output_0",
  "Pooling160_Output_0",
  "Plus214_Output_0",
]
