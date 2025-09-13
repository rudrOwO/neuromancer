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
- Before painting each frame, extract values from the network and render them into 3d with Threlte.

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

> [!NOTE]  
> Work in progress- More models and features are on the way 🫡

## Visit the [Live Demo](https://neuromancer.rudro.me) or Run Locally

```shell
  git clone https://github.com/rudrowo/neuromancer &&\
  cd neuromancer &&\
  npm install &&\
  npm run dev
```

## My Takes & Stuff I Learned

<details>
  <summary>Click to expand</summary>

- **[ WebAssembly ](https://www.youtube.com/watch?v=cbB3QEwWMlA) is awesome:** Modern web browsers pretty much stand in par with lightweight virtual machines. Many intensive computations that once
  needed a dedicated server can now be done via WebAssembly on a client's machine. This includes everything from
  running [AutoCAD](https://www.youtube.com/watch?v=BfkL3WgOPdI) to neural networks.

- **Concurrency is awesome when done right:** I learned about co-ordinating between webworkers to offload expensive
  neural net computations and deliver a responsive user interface. Still nowhere near as good as Go's concurrency though 🥱.

- **Power of declarative code:**
  - I used Threlte, a library built on top of three.js to write declarative 3d components as if they were regular DOM nodes!.
  - It is always more intuitive to define what you want rather than writing the steps to get there 🗿.

- **Vite deepdive:** Vite is a super awesome bundler that comes with a ton of quality of life features for great DX. I learned about things such as:
  - Importing files as webworkers!.
  - Code-splitting with dynamic import- great for reducing initial load times.
  - You can even write custom middleware for the vite development server!! I used this feature to correctly set the MIME type of .wasm files during development- which were for some reason (🐛) being sent over as plaintext.

- **3D raycasting for interactivity:** Did you know 3d graphics emulate mouse interaction by casting a ray and calculating whether it intersects
  with objects? Well now you do.

- **Svelte 5 is awesome- _chef's kiss_:**
  - Signal-driven reactivity is a godsend!
  - What I really enjoyed about Svelte is this- **I never had to think about what my UI framework was doing under the hood**.
  - No more `useFootgun()` hooks to ruin my day ⚛️😐.

</details>

## Inspired by

- [These YouTube Videos](https://www.youtube.com/playlist?list=PLYLFPRdcr4f3uq4ji1JgXTt0gITCitG45)
- [Netron](https://github.com/lutzroeder/netron)
- [Transformer Explainer](https://github.com/poloclub/transformer-explainer)
- [ONNX Runtime Web Demo](https://github.com/microsoft/onnxruntime-web-demo)

<br>

Icons attribution: [SVGRepo](https://www.svgrepo.com), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page)
