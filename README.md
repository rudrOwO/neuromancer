<div align="center">

# Neuromancer

### 👀 Visualize Neural Networks Blazingly Fast <img src="/docs/speed.gif" width="62px" style="display: inline;" alt="Bun Logo" /> in 3D

<img src="/docs/demo.gif" width="80%" alt="Preview GIF"/>

</div>

## What is Neuromancer?

Neuromancer is a real-time **3D neural network visualizer** that runs entirely in your browser. Draw a digit on the canvas and watch a convolutional neural network (CNN) process it live — activation maps, intermediate tensors, and final predictions are all rendered in an interactive 3D scene.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | [Svelte 5](https://svelte.dev) with TypeScript |
| 3D rendering | [Three.js](https://threejs.org) via [Threlte](https://threlte.xyz) |
| ML inference | [ONNX Runtime Web](https://onnxruntime.ai) (WASM + SIMD) |
| Build tool | [Vite](https://vitejs.dev) |
| Runtime / package manager | [Bun](https://bun.sh) |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com) |
| Model editing | Python + [onnx](https://pypi.org/project/onnx/) package |

## How it works

- The neural network runs in a separate [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) via [ONNX Runtime Web](https://onnxruntime.ai), keeping the UI thread free.
- Models have been modified to expose their internal tensors at every layer. Inference output is transferred to the main thread using zero-copy [Transferable](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects) `ArrayBuffer`s.
- The 3D scene is updated asynchronously at 30 FPS.

<br>

<div align="center">
  <img src="/docs/workflow.excalidraw.svg" width="70%" alt="How it works"/>
</div>

<br>

This dual-thread architecture is reflected in the source layout:

<pre>
./web
├── onnx/          ← Web Worker: model loading, warm-up, inference
│   ├── entrypoint.ts
│   └── runmodel.ts
├── ui/            ← Main thread: Svelte components, 3D scene
│   ├── App.svelte
│   ├── components/
│   ├── constants/
│   ├── sharedstate/
│   ├── types/
│   └── utils/
├── bridge.ts      ← Typed message-passing API between threads
└── main.ts        ← Entry point: mounts Svelte app + spawns worker
</pre>

## Models You Can Visualize

1. [Convolutional neural network for identifying handwritten digits (MNIST dataset)](https://huggingface.co/onnxmodelzoo/mnist-12)
2. [AlexNet (planned)](https://en.wikipedia.org/wiki/AlexNet)

> Models have been modified using the [ONNX python package](https://pypi.org/project/onnx/) — see the `modeleditor/` directory for the scripts.

> [!NOTE]  
> Work in progress — more models and features are on the way 🫡

## Visit the [Live Demo](https://neuromancer.rudro.me) or Run Locally

```shell
  git clone https://github.com/rwdr0/neuromancer &&\
  cd neuromancer &&\
  npm install &&\
  npm run preview
```

## Inspired by

- [These YouTube Videos](https://www.youtube.com/playlist?list=PLYLFPRdcr4f3uq4ji1JgXTt0gITCitG45)
- [Netron](https://github.com/lutzroeder/netron)
- [Transformer Explainer](https://github.com/poloclub/transformer-explainer)
- [ONNX Runtime Web Demo](https://github.com/microsoft/onnxruntime-web-demo)

<br>

Icons attribution: [SVGRepo](https://www.svgrepo.com), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page)
