// Communication bridge between webworkers => resoponsive UI with asynchronous updates

import { setInferenceResponse } from "@sharedstate/inference.svelte"
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
  dimension: readonly number[]
  activationMaps: Float32Array[]
}

export type InferenceResponse = {
  isSuccessful: boolean
  orderedOutputNodes: OutputNode[]
  predictions: Float32Array
}

function registerDefaultEventListener() {
  onnxRuntime.addEventListener(
    "message",
    (event: MessageEvent<InferenceResponse>) => {
      if (event.data.isSuccessful) {
        setInferenceResponse(event.data)
      } else {
        console.error("default message hanlder has received malformed data")
      }
    },
  )
}

export function initializeModel(
  modelURL: string,
  inputTensorDimension: number[],
): Promise<InitializationResponse> {
  return new Promise((resolve, reject) => {
    const handler = (event: MessageEvent<InitializationResponse>) => {
      if (event.data.isSuccessful) {
        registerDefaultEventListener()
        resolve(event.data)
      } else {
        reject()
      }
      onnxRuntime.removeEventListener("message", handler)
    }

    onnxRuntime.addEventListener("message", handler)

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
) {
  const message: InferenceRequest = {
    action: "run",
    inputTensorData,
    inputTensorDimension,
    orderedOutputNodeNames,
    finalNodeName,
  }

  onnxRuntime.postMessage(message, { transfer: [inputTensorData.buffer] })
}
