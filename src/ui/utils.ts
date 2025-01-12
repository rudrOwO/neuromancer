import type { Tensor } from "onnxruntime-web"
import { onnxRuntime } from "main"

export type DispatchMessage = {
  action: "initialize" | "run"
  payload: ArrayBuffer
}

export function initializeModel(model: ArrayBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const eventHandler = function (event: MessageEvent<boolean>) {
      if (event.data == true) {
        resolve()
      } else {
        reject()
      }
      onnxRuntime.removeEventListener("message", eventHandler)
    }
    onnxRuntime.addEventListener("message", eventHandler)

    const message: DispatchMessage = {
      action: "initialize",
      payload: model,
    }
    onnxRuntime.postMessage(message, { transfer: [model] })
  })
}

export function runModel(inputTensor: Tensor): Promise<Tensor> {
  return new Promise((resolve) => {})
}
