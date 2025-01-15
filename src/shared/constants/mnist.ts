export const modelURL = `${import.meta.env.VITE_PUBLIC_URL}/mnist-12.onnx`
export const inputDimension = [1, 1, 28, 28]
export const orderedOutputNodes = [
  "Pooling66_Output_0",
  "Pooling160_Output_0",
  "Plus214_Output_0",
]
