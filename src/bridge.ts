import type { Tensor, InferenceSession } from "onnxruntime-web"
import { onnxRuntime } from "main"

export type InitializationRequest = {
  action: "initialize"
  modelURL: string
}

export type RunRequest = {
  action: "run"
  inputTensor: Tensor
}

export type InitializationResponse = {
  isSuccessful: boolean
}

export type RunResponse = {
  isSuccessful: boolean
  layers: InferenceSession.OnnxValueMapType
  predictions: Array<number>
}

export function initializeModel(
  modelURL: string,
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
    }
    onnxRuntime.postMessage(message)
  })
}

export function runModel(inputTensor: Tensor): Promise<RunResponse> {
  return new Promise((resolve, reject) => {
    const eventHandler = function (event: MessageEvent<RunResponse>) {
      if (event.data.isSuccessful == true) {
        resolve(event.data)
      } else {
        reject()
      }
      onnxRuntime.removeEventListener("message", eventHandler)
    }
    onnxRuntime.addEventListener("message", eventHandler)

    const message: RunRequest = {
      action: "run",
      inputTensor,
    }
    onnxRuntime.postMessage(message, { transfer: [inputTensor] })
  })
}
