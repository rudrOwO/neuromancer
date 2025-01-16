import type {
  InitializationRequest,
  RunRequest,
  InitializationResponse,
  RunResponse,
} from "shared/bridge"
import { Tensor, type InferenceSession } from "onnxruntime-web"
import { createModel, runModel, warmupModel } from "onnx/runmodel"

let model: InferenceSession

onmessage = async (event: MessageEvent<InitializationRequest | RunRequest>) => {
  if (event.data.action == "initialize") {
    let request = event.data
    let response: InitializationResponse = { isSuccessful: false }
    try {
      model = await createModel(request.modelURL)
      warmupModel(model, request.inputTensorDimension) // No need to await this, warmup is only a performance improvement
      response.isSuccessful = true
    } catch (error) {
      console.error("Error INITIALIZING model", error)
    } finally {
      postMessage(response)
    }
  } else {
    let request = event.data
    let response: RunResponse = {
      outputNodes: {},
      isSuccessful: false,
    }
    const transfer = [] // PERF  Transfering buffers instead of copying them over
    try {
      const inputTensor = new Tensor(
        "float32",
        request.inputTensorData,
        request.inputTensorDimension,
      )
      const inferenceResult = await runModel(model, inputTensor)
      response.isSuccessful = true

      for (const [nodeName, tensor] of Object.entries(inferenceResult)) {
        response.outputNodes[nodeName] = {
          tensorData: tensor.data as Float32Array,
          tensorDimension: tensor.dims,
        }

        transfer.push((tensor.data as Float32Array).buffer)
      }
    } catch (error) {
      console.error("Error while RUNNING model", error)
    } finally {
      postMessage(response, { transfer })
    }
  }
}
