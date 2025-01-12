import type { Tensor } from "onnxruntime-web"
import { onnxRuntime } from "main"

export type Request = {
  action: "initialize" | "run"
  payload: ArrayBuffer
}

export type InitializationResponse = {
  isSuccessful: boolean
}

export type ResultResponse = {}

export function initializeModel(model: ArrayBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const eventHandler = function (
      event: MessageEvent<InitializationResponse>,
    ) {
      if (event.data.isSuccessful == true) {
        resolve()
      } else {
        reject()
      }
      onnxRuntime.removeEventListener("message", eventHandler)
    }
    onnxRuntime.addEventListener("message", eventHandler)

    const message: Request = {
      action: "initialize",
      payload: model,
    }
    onnxRuntime.postMessage(message, { transfer: [model] })
  })
}

export function runModel(inputTensor: Tensor): Promise<ResultResponse> {
  return new Promise((resolve) => {})
}
