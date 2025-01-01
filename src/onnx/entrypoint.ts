import { Tensor } from 'onnxruntime-web';

onmessage = (event) => {
  console.log('Received from main thread:', event.data);

  // create a [2x3x4] float tensor
  //
  const buffer01 = new Float32Array(24);
  buffer01[0] = 0.1; // fill buffer data
  const tensor01 = new Tensor('float32', buffer01, [2, 3, 4]);


  // Respond to the main thread
  postMessage(tensor01);
};
