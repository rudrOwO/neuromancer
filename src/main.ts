import { mount } from "svelte"
import App from "ui/App.svelte"
import ONNXRuntime from "onnx/entrypoint.ts?worker"
import "ui/global.css"

export const onnxRuntime = new ONNXRuntime()
const app = mount(App, { target: document.body })

export default app
