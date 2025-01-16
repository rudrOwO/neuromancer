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
}

export type InferenceResponse = {
  isSuccessful: boolean
  outputNodes: {
    [key: string]: {
      tensorData: Float32Array
      tensorDimension: readonly number[]
    }
  }
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
    }

    onnxRuntime.postMessage(message, { transfer: [inputTensorData.buffer] })
  })
}
