import { TENSOR_DEFAULT_GRAY_VALUE } from "@constants/graphics"

export function softmax(tensorData: Float32Array): number[] {
  const arr = Array.from(tensorData)
  const C = Math.max(...arr)
  const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b)
  return arr.map((value) => {
    return Math.exp(value - C) / d
  })
}

export function postProcess(
  tensorData: Float32Array,
  tensorDimension: readonly number[],
): Float32Array[] {
  const numberOfTensors = tensorDimension[1]
  const activationMapLength = tensorDimension[2] * tensorDimension[3]
  const activationMaps: Float32Array[] = []

  for (let i = 0; i < numberOfTensors; i += 1) {
    const activationMap = new Float32Array(activationMapLength)

    const subTensor = tensorData.subarray(
      i * activationMapLength,
      (i + 1) * activationMapLength,
    )

    let min = Number.MAX_VALUE
    let max = -1
    activationMap.fill(TENSOR_DEFAULT_GRAY_VALUE)

    for (const t of subTensor) {
      if (t < min) {
        min = t
      }

      if (t > max) {
        max = t
      }
    }

    const range = max - min

    for (let i = 0; i < subTensor.length; i += 1) {
      const brightness = Math.min(
        1.0,
        activationMap[i] + (subTensor[i] - min) / range,
      )
      activationMap[i] = brightness
    }

    activationMaps.push(activationMap)
  }

  return activationMaps
}
