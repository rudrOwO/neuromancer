import { InferenceSession, Tensor } from "onnxruntime-web"

/*
 * Portions of this code are derived from ONNX Runtime Web Demo which is licensed under the MIT License.
 *
 * Copyright (c) Microsoft Corporation.
 * All rights reserved.
 *
 * This file has been modified by Dardaul (Rudro) Hoque and is also licensed under the MIT License.
 *
 * Modified sources:
 * https://github.com/microsoft/onnxruntime-web-demo/blob/35239ea55876779fae9829654ce60fb352b252d7/src/utils/runModel.ts
 *
 * The original full license text is available in the root directory of this project.
 */

export async function createModel(modelURL: string): Promise<InferenceSession> {
  return await InferenceSession.create(modelURL, {
    executionProviders: ["wasm"],
  })
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
  try {
    const feeds: Record<string, Tensor> = {}
    feeds[model.inputNames[0]] = preprocessedData
    return await model.run(feeds)
  } catch (error) {
    throw error
  }
}
