import type {
  InitializationRequest,
  RunRequest,
  InitializationResponse,
  RunResponse,
} from "shared/bridge"
import { Tensor, type InferenceSession } from "onnxruntime-web"
import { createModel, runModel, warmupModel } from "onnx/runmodel"
import { inputDimension } from "shared/constants/mnist"

let model: InferenceSession

onmessage = async (event: MessageEvent<InitializationRequest | RunRequest>) => {
  if (event.data.action == "initialize") {
    let response: InitializationResponse
    try {
      model = await createModel(event.data.modelURL)
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
      const size = inputDimension.reduce((a, b) => a * b)
      const inputTensor = new Tensor(
        "float32",
        new Float32Array(size),
        inputDimension,
      )
      const result = await runModel(model, inputTensor)
      response = {
        nodes: result,
        isSuccessful: true,
      }
    } catch (error) {
      console.error("Error while RUNNING model", error)
      response = {
        nodes: null!,
        isSuccessful: false,
      }
    }

    // PERF  Transfering buffers instead of copying them over
    const transfer = []
    for (const tensor of Object.values(response.nodes)) {
      //@ts-ignore
      transfer.push(tensor.data.buffer)
    }
    postMessage(response, { transfer })
  }
}
