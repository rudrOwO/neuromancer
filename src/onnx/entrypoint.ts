import { createModel, runModel, warmupModel } from "onnx/runmodel"
import { Tensor, type InferenceSession } from "onnxruntime-web"
import type {
  InferenceRequest,
  InferenceResponse,
  InitializationRequest,
  InitializationResponse,
} from "shared/bridge"

let model: InferenceSession

onmessage = async (
  event: MessageEvent<InitializationRequest | InferenceRequest>,
) => {
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
    let response: InferenceResponse = {
      outputNodes: {},
      isSuccessful: false,
    }
    /*
      Transfering buffers instead of an expresive serialized copy
      https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects
     */
    const transfer = []
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
