<div align="center">

# Neuromancer

### 👀 Visualize Neural Networks Blazingly Fast <img src="/.docs/speed.gif" width="62px" style="display: inline;" alt="Bun Logo" /> in 3D

<img src="/.docs/demo.gif" width="80%" alt="Preview GIF"/>

</div>

## Tech Used

- [Svelte](https://svelte.dev/), [Tailwind CSS](https://tailwindcss.com)
- [Threlte - 3D library based on svelte and three.js](https://threlte.xyz)
- [Open Neural Network Exchange - ONNX Web Runtime](https://onnxruntime.ai)

## How it works

- I run a neural network in a seperate webworker using ONNX Web Runtime.
- Output from the neural network is transferred over to main thread using efficient [Transferable](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects) ArrayBuffer.
- The 3D neural network is updated [asynchronously](https://github.com/rudrOwO/neuromancer/blob/8504a934dccac62e01b6ceb8a00f6ff7b00733e7/src/bridge.ts) @ 30 FPS.

<br>

<div align="center">
  <img src="/.docs/workflow.excalidraw.svg" width="70%" alt="How it works"/>
</div>

<br>

This dual-thread architecture is also reflected in the arrangement of `src/` directory:

<pre>
./src
├── onnx
├── ui
├── bridge.ts
└── main.ts
</pre>

## Models

1. [ convolutional neural network for identifying handwritten digits (MNIST dataset) ](https://github.com/onnx/models/tree/main/validated/vision/classification/mnist)
2. [ AlexNet (planned) ](https://github.com/onnx/models/tree/main/validated/vision/classification/alexnet)

### Editing Models

Models have been edited with [ONNX python package](https://pypi.org/project/onnx/) to expose internal tensors and post-process them into a format suitable for 3D rendering. You'll need [uv](https://docs.astral.sh/uv/) to run the python project.

> [!NOTE]  
> Work in progress- More models and features are on the way 🫡

## Visit the [Live Demo](https://neuromancer.rudro.me) or Run Locally

```shell
  git clone https://github.com/rudrowo/neuromancer &&\
  cd neuromancer &&\
  npm install &&\
  npm run dev
```

## Inspired by

- [These YouTube Videos](https://www.youtube.com/playlist?list=PLYLFPRdcr4f3uq4ji1JgXTt0gITCitG45)
- [Netron](https://github.com/lutzroeder/netron)
- [Transformer Explainer](https://github.com/poloclub/transformer-explainer)
- [ONNX Runtime Web Demo](https://github.com/microsoft/onnxruntime-web-demo)

<br>

Icons attribution: [SVGRepo](https://www.svgrepo.com), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page)
