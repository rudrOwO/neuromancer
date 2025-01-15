import type { InferenceSession } from "onnxruntime-web"
import { onnxRuntime } from "main"

export type InitializationRequest = {
  action: "initialize"
  modelURL: string
}

export type RunRequest = {
  action: "run"
  inputArraybuffer: Float32Array
}

export type InitializationResponse = {
  isSuccessful: boolean
}

export type RunResponse = {
  isSuccessful: boolean
  nodes: InferenceSession.OnnxValueMapType
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

export function runModel(inputArraybuffer: Float32Array): Promise<RunResponse> {
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
      inputArraybuffer,
    }

    onnxRuntime.postMessage(message, { transfer: [inputArraybuffer.buffer] })
  })
}
