import type { DispatchMessage } from "@ui/utils"
import { createModel, warmupModel } from "@onnx/utils/runmodel"
import { inputDimension } from "@onnx/mnist/constants"

onmessage = async (event: MessageEvent<DispatchMessage>) => {
  switch (event.data.action) {
    case "initialize":
      try {
        const model = await createModel(event.data.payload)
        warmupModel(model, inputDimension)
        postMessage(true)
      } catch (error) {
        postMessage(false)
      }
      break

    case "run":
    // TODO  Implement runner
  }
}
