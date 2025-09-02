import { inject as vercelAnalytics } from "@vercel/analytics"
import { mount } from "svelte"
import App from "ui/App.svelte"
import ONNXRuntime from "onnx/entrypoint.ts?worker"
import "ui/global.css"

vercelAnalytics()

export const onnxRuntime = new ONNXRuntime()

const app = mount(App, {
  target: document.getElementById("app")!,
})

export default app
