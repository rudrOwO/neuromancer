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
  await model.run(feeds)
}

export async function runModel(
  model: InferenceSession,
  preprocessedData: Tensor,
) {
  // const start = new Date()
  try {
    const feeds: Record<string, Tensor> = {}
    feeds[model.inputNames[0]] = preprocessedData
    const output = await model.run(feeds)

    // const end = new Date()
    // const inferenceTime = end.getTime() - start.getTime()
    // console.log(`Model run with time ${inferenceTime}`)

    return output
  } catch (error) {
    throw error
  }
}
