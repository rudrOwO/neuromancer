import { createModel, runModel, warmupModel } from "onnx/runmodel"
import { Tensor, type InferenceSession } from "onnxruntime-web"
import type {
  InferenceRequest,
  InferenceResponse,
  InitializationRequest,
  InitializationResponse,
} from "shared/bridge"
import { normaliseForRender, softmax } from "onnx/postprocess"

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
      orderedActivationMaps: [],
      isSuccessful: false,
      predictions: [],
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
      response.predictions = softmax(
        inferenceResult[request.finalNodeName].data as Float32Array,
      )

      // Loading activation maps
      for (const nodeName of request.orderedOutputNodeNames) {
        const tensor = inferenceResult[nodeName]

        const activationMap = {
          tensorData: normaliseForRender(tensor.data as Float32Array),
          tensorDimension: tensor.dims,
        }

        response.orderedActivationMaps.push(activationMap)
        transfer.push(activationMap.tensorData.buffer)
      }
    } catch (error) {
      console.error("Error while RUNNING model", error)
    } finally {
      postMessage(response, { transfer })
    }
  }
}
