<div align="center">

# Neuromancer

3d Convolutional Neural Network Visualilzer

![Preview video](/docs/demo.gif)

</div>

## Tech Used

- [Svelte - UI framework](https://svelte.dev/)
- [Threlte - 3D library based on svelte and three.js](https://threlte.xyz)
- [Open Neural Network Exchange - ONNX Web Runtime](https://onnxruntime.ai)

## How it works

- I run a neural network in a seperate webworker using [ONNX Web Runtime](https://onnxruntime.ai/docs/tutorials/web/).
- Before painting each frame, extract values from the network and render them into 3d with three.js.

  <br>

  <img src="/docs/workflow.excalidraw.svg"/>

## Models

1. [ convolutional neural network for identifying handwritten digits (MNIST dataset) ](https://github.com/onnx/models/tree/main/validated/vision/classification/mnist)
2. [ AlexNet (planned) ](https://github.com/onnx/models/tree/main/validated/vision/classification/alexnet)

## Inspired by

- [These YouTube Videos](https://www.youtube.com/playlist?list=PLYLFPRdcr4f3uq4ji1JgXTt0gITCitG45)
- [Netron](https://github.com/lutzroeder/netron)
- [Transformer Explainer](https://github.com/poloclub/transformer-explainer)
- [ONNX Runtime Web Demo](https://github.com/microsoft/onnxruntime-web-demo)

## Stuff I learned on this project

- **WebAssembly is awesome:** In 2025 your browser is pretty much a mini virtual machine lol. No need to spin-up a costly server- just run a neural
  network in your client's browser.

- **Concurrency is awesome when done right:** I learned about co-ordinating between webworkers to offload expensive
  neural net computations and deliver a responsive user interface. Still nowhere near as good as Go's concurrency though 🥱.

- **Power of declarative code:**
  - I used Threlte (awesome library btw!) to write declarative 3d components as if they were regular
    DOM nodes!.
  - It is always more intuitive to define what you want rather than writing the steps to get there 🗿.

- **Vite deepdive:** Vite is a super awesome bundler that comes with a ton of quality of life features for great developer experience.
  I learned about things such as:
  - Importing files as webworkers!,
  - Code-splitting with dynamic import- great for reducing initial load times.
  - You can even write custom middleware for the vite development server!! I used this feature to ship .wasm files during development.

- **3D raycasting for interactivity:** Did you know 3d graphics emulate mouse interaction by casting a ray and calculating whether it intersects
  with objects? Well now you do.

- **Svelte 5 is awesome- _chef's kiss_:**
  - Signal-driven reactivity is a godsend!
  - Sevelte 5 offers a much better DX than react- where you have to spend half your time just fighting the framework 🤷.
    No more `useFootgun()` hooks to ruin my day 💀.

<br>

Icons attribution: [SVGRepo](https://www.svgrepo.com), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page)
