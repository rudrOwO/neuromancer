import { InferenceSession, Tensor } from "onnxruntime-web"

export async function createModel(
  model: ArrayBuffer,
): Promise<InferenceSession> {
  return await InferenceSession.create(model, { executionProviders: ["wasm"] })
}

export async function warmupModel(model: InferenceSession, dims: number[]) {
  // generate a random input and call Session.run() as a warmup query
  const size = dims.reduce((a, b) => a * b)
  const warmupTensor = new Tensor("float32", new Float32Array(size), dims)

  for (let i = 0; i < size; i++) {
    warmupTensor.data[i] = Math.random() * 2.0 - 1.0 // random value [-1.0, 1.0)
  }

  const feeds: Record<string, Tensor> = {}
  feeds[model.inputNames[0]] = warmupTensor
  // DEBUG  Remove this log
  const result = await model.run(feeds)
  console.log(result)
}

export async function runModel(
  model: InferenceSession,
  preprocessedData: Tensor,
): Promise<[Tensor, number]> {
  const start = new Date()
  try {
    const feeds: Record<string, Tensor> = {}
    feeds[model.inputNames[0]] = preprocessedData
    const outputData = await model.run(feeds)
    const end = new Date()
    const inferenceTime = end.getTime() - start.getTime()
    // TODO  Modify this to emit activation maps as well
    const output = outputData[model.outputNames[0]]

    console.log(`Model run with time ${inferenceTime}`)

    return [output, inferenceTime]
  } catch (error) {
    console.error("Error while RUNNING model", error)
    throw error
  }
}
