import { TENSOR_DEFAULT_GRAY_VALUE } from "@constants/graphics"
import type { InferenceResponse, OutputNode } from "bridge"

export const MODEL_URL = `${import.meta.env.VITE_PUBLIC_URL}/mnist-12.onnx`
export const INPUT_TENSOR_DIMENSION = [1, 1, 28, 28]
export const ORDERED_NODE_NAMES = [
  "ReLU32_Output_0",
  "Pooling66_Output_0",
  "ReLU114_Output_0",
  "Pooling160_Output_0",
]
export const FINAL_NODE = "Plus214_Output_0"
const ORDERED_NODE_DIMENSIONS = [
  [1, 8, 28, 28],
  [1, 8, 14, 14],
  [1, 16, 14, 14],
  [1, 16, 4, 4],
]

export const ACTIVATION_MAPS_DEFAULT_VALUE: InferenceResponse = {
  isSuccessful: false,
  orderedOutputNodes: (() => {
    const orderedOutputNodes: OutputNode[] = []

    for (let i = 0; i < ORDERED_NODE_NAMES.length; i += 1) {
      const tensorDimension = ORDERED_NODE_DIMENSIONS[i]
      const numberOfTensors = tensorDimension[1]
      const activationMapLength = tensorDimension[2] * tensorDimension[3]
      const activationMaps: Float32Array[] = new Array(numberOfTensors)

      for (let i = 0; i < numberOfTensors; i += 1) {
        activationMaps[i] = new Float32Array(3 * activationMapLength)
        activationMaps[i].fill(TENSOR_DEFAULT_GRAY_VALUE)
      }

      orderedOutputNodes.push({
        dimension: tensorDimension,
        activationMaps,
      })
    }

    return orderedOutputNodes
  })(),
  predictions: Array(10).fill(0.1), // Probability of 1 distributed equally among 10 possibilities
}

export const INPUT_TENSOR_DEFAULT_VALUE = (() => {
  const newTensor = new Float32Array(
    3 * INPUT_TENSOR_DIMENSION.reduce((a, b) => a * b),
  )
  newTensor.fill(TENSOR_DEFAULT_GRAY_VALUE)
  return newTensor
})()

export type LayerName =
  | ""
  | "Input"
  | "Convolution Layer #1"
  | "Max Pool #1"
  | "Convolution Layer #2"
  | "Max Pool #2"

type Kernel = {
  stride: number
  dimension: number
  tick: number
}

type KernelEntry = {
  masked: Kernel
  unmasked: Pick<Kernel, "stride" | "dimension"> // tick musk be the same for both masked and unmasked tensor
}

export const KERNEL_INFO: Partial<Record<LayerName, KernelEntry>> = {
  "Convolution Layer #1": {
    masked: {
      stride: 1,
      dimension: 5,
      tick: 10,
    },
    unmasked: {
      stride: 1,
      dimension: 5,
    },
  },
  "Max Pool #1": {
    masked: {
      stride: 2,
      dimension: 2,
      tick: 30,
    },
    unmasked: {
      stride: 1,
      dimension: 1,
    },
  },
  "Convolution Layer #2": {
    masked: {
      stride: 1,
      dimension: 5,
      tick: 50,
    },
    unmasked: {
      stride: 1,
      dimension: 5,
    },
  },
  "Max Pool #2": {
    masked: {
      stride: 3,
      dimension: 3,
      tick: 200,
    },
    unmasked: {
      stride: 1,
      dimension: 1,
    },
  },
}
