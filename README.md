<div align="center">

# Neuromancer

### 👀 Visualize Neural Networks Blazingly Fast <img src="/docs/speed.gif" width="62px" style="display: inline;" alt="Bun Logo" /> in 3D

<img src="/docs/demo.gif" width="80%" alt="Preview GIF"/>

</div>

## How it works

- I run a neural network in a seperate [webworker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) using [ONNX Web Runtime](https://onnxruntime.ai).
- The neural net has been modified to expose its internal tensors. Output from the neural net is transferred over to main thread using efficient [Transferable](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects) ArrayBuffer.
- The 3D neural network is updated asynchronously @ 30 FPS.

<br>

<div align="center">
  <img src="/docs/workflow.excalidraw.svg" width="70%" alt="How it works"/>
</div>

<br>

This dual-thread architecture is also reflected in source:

<pre>
./web
├── onnx/
├── ui/
├── bridge.ts
└── main.ts
</pre>

## Models You Can Visualize

1. [ Convolutional neural network for identifying handwritten digits (MNIST dataset) ](https://huggingface.co/onnxmodelzoo/mnist-12)
2. [ AlexNet (planned) ](https://en.wikipedia.org/wiki/AlexNet)

> Models have been modified using [ONNX python package](https://pypi.org/project/onnx/).

> [!NOTE]  
> Work in progress- More models and features are on the way 🫡

## Visit the [Live Demo](https://neuromancer.rudro.me) or Run Locally

```shell
  git clone https://github.com/rudrowo/neuromancer &&\
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
