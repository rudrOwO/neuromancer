export function softmax(tensorData: Float32Array): number[] {
  const arr = Array.from(tensorData)
  const C = Math.max(...arr)
  const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b)
  return arr.map((value) => {
    return Math.exp(value - C) / d
  })
}

// Rescaling (min-max normalization) in range [0 - 255] for 3D rendering
export function normaliseForRender(tensorData: Float32Array): Float32Array {
  let min = Number.MAX_VALUE
  let max = -1
  const normalizedTensorData = new Float32Array(tensorData.length)

  for (const t of tensorData) {
    if (t < min) {
      min = t
    }

    if (t > max) {
      max = t
    }
  }

  const scale = 255 / (max - min)
  for (let i = 0; i < tensorData.length; i++) {
    normalizedTensorData[i] = (tensorData[i] - min) * scale
  }

  return normalizedTensorData
}
