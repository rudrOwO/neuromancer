import type { InitializationRequest, RunRequest } from "bridge"
import type { InitializationResponse, RunResponse } from "bridge"
import type { InferenceSession } from "onnxruntime-web"
import { createModel, runModel, warmupModel } from "@onnx/utils/runmodel"
import { inputDimension } from "@onnx/mnist/constants"

let model: InferenceSession

onmessage = async (event: MessageEvent<InitializationRequest | RunRequest>) => {
  if (event.data.action == "initialize") {
    let response: InitializationResponse
    try {
      model = await createModel(event.data.serializedModel)
      warmupModel(model, inputDimension) // No need to await this:
      response = { isSuccessful: true } // only a performance improvement for later runs
    } catch (error) {
      console.error("Error INITIALIZING model", error)
      response = { isSuccessful: false }
    }
    postMessage(response)
  } else {
    let response: RunResponse
    try {
      const result = await runModel(model, event.data.inputTensor)
      response = {
        layers: result,
        predictions: [0], // NOTE  Call Postprocess here
        isSuccessful: true,
      }
    } catch (error) {
      console.error("Error while RUNNING model", error)
      response = {
        layers: null!,
        predictions: null!,
        isSuccessful: false,
      }
    }
    postMessage(response)
  }
}
