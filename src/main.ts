import { mount } from "svelte"
import "ui/app.css"
import App from "ui/App.svelte"
import ONNXRuntime from "onnx/entrypoint.ts?worker"

export const onnxRuntime = new ONNXRuntime()

const app = mount(App, {
  target: document.getElementById("app")!,
})

export default app
