import type { Request } from "bridge"
import { createModel, warmupModel } from "@onnx/utils/runmodel"
import { inputDimension } from "@onnx/mnist/constants"
import type { InitializationResponse, ResultResponse } from "bridge"

onmessage = async (event: MessageEvent<Request>) => {
  if (event.data.action == "initialize") {
    let response: InitializationResponse
    try {
      const model = await createModel(event.data.payload)
      warmupModel(model, inputDimension) // No need to await this:
      response = { isSuccessful: true } // only a performance improvement for later runs
    } catch (error) {
      response = { isSuccessful: false }
    }
    postMessage(response)
  } else {
    let response: ResultResponse
    // TODO  Implement runner
  }
}
