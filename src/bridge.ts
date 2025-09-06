import { onnxRuntime } from "main"

// Communication bridge between webworkers, made by wrapping message events with Promise

export type InitializationRequest = {
  action: "initialize"
  modelURL: string
  inputTensorDimension: number[]
}

export type InitializationResponse = {
  isSuccessful: boolean
}

export type InferenceRequest = {
  action: "run"
  inputTensorData: Float32Array
  inputTensorDimension: number[]
  orderedOutputNodeNames: string[]
  finalNodeName: string
}

export type OutputNode = {
  dimension: readonly number[]
  activationMaps: Float32Array[]
}

export type InferenceResponse = {
  isSuccessful: boolean
  orderedOutputNodes: OutputNode[]
  predictions: number[]
}

export function initializeModel(
  modelURL: string,
  inputTensorDimension: number[],
): Promise<InitializationResponse> {
  return new Promise((resolve, reject) => {
    onnxRuntime.onmessage = function (
      event: MessageEvent<InitializationResponse>,
    ) {
      if (event.data.isSuccessful) {
        resolve(event.data)
      } else {
        reject()
      }
    }

    const message: InitializationRequest = {
      action: "initialize",
      modelURL,
      inputTensorDimension,
    }

    onnxRuntime.postMessage(message)
  })
}

export function runModel(
  inputTensorData: Float32Array,
  inputTensorDimension: Array<number>,
  orderedOutputNodeNames: string[],
  finalNodeName: string,
): Promise<InferenceResponse> {
  return new Promise((resolve, reject) => {
    onnxRuntime.onmessage = function (event: MessageEvent<InferenceResponse>) {
      if (event.data.isSuccessful) {
        resolve(event.data)
      } else {
        reject()
      }
    }

    const message: InferenceRequest = {
      action: "run",
      inputTensorData,
      inputTensorDimension,
      orderedOutputNodeNames,
      finalNodeName,
    }

    onnxRuntime.postMessage(message, { transfer: [inputTensorData.buffer] })
  })
}
