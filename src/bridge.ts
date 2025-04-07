import { onnxRuntime } from "main"

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
  name: string
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
    const eventHandler = function (
      event: MessageEvent<InitializationResponse>,
    ) {
      if (event.data.isSuccessful == true) {
        resolve(event.data)
      } else {
        reject()
      }
      onnxRuntime.removeEventListener("message", eventHandler)
    }
    onnxRuntime.addEventListener("message", eventHandler)

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
    const eventHandler = function (event: MessageEvent<InferenceResponse>) {
      if (event.data.isSuccessful == true) {
        resolve(event.data)
      } else {
        reject()
      }
      onnxRuntime.removeEventListener("message", eventHandler)
    }
    onnxRuntime.addEventListener("message", eventHandler)

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
