<div align="center">

# Neuromancer

3d Convolutional Neural Network Visualilzer

![Preview video](/notes/demo.gif)

</div>

## Tech Used

- [Svelte - UI framework](https://svelte.dev/)
- [Threlte - 3D library based on svelte and three.js](https://threlte.xyz)
- [Open Neural Network Exchange - ONNX Web Runtime](https://onnxruntime.ai)

## How it works

- I run a neural network in a seperate webworker using [ONNX Web Runtime](https://onnxruntime.ai/docs/tutorials/web/).
- Before painting each frame, extract values from the network and render them into 3d with three.js.
  <br>
  <br>
  <img src="/notes/workflow.excalidraw.svg"/>

## Models

1. [ convolutional neural network for identifying handwritten digits (MNIST dataset) ](https://github.com/onnx/models/tree/main/validated/vision/classification/mnist)
2. [ AlexNet (planned) ](https://github.com/onnx/models/tree/main/validated/vision/classification/alexnet)

### Inspired by

- [These YouTube Videos](https://www.youtube.com/playlist?list=PLYLFPRdcr4f3uq4ji1JgXTt0gITCitG45)
- [Netron](https://github.com/lutzroeder/netron)
- [Transformer Explainer](https://github.com/poloclub/transformer-explainer)

Icons attribution:

- [SVGRepo](https://www.svgrepo.com)
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page)
