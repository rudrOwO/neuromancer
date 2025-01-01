import { Tensor, InferenceSession } from 'onnxruntime-web';


onmessage = async (event) => {
  console.log('Received from main thread:', event.data);

  // create a [2x3x4] float tensor
  //
  const inputTensor = new Tensor('float32', new Float32Array(28 * 28), [1, 1, 28, 28])
  const modelURL = `${import.meta.env.VITE_PUBLIC_URL}/${import.meta.env.VITE_MODEL_NAME}`

  const outputMap: InferenceSession.NullableOnnxValueMapType = {
    "Convolution28_Output_0": new Tensor('float32', new Float32Array(8 * 28 * 28), [1, 8, 28, 28]),
  }

  const session = await InferenceSession.create(modelURL)

  const output = await session.run({
    "Input3": inputTensor
  },
  )

  // Respond to the main thread
  postMessage(output);
};
