<script lang="ts">
  import DigitInputPanel from "@components/DigitInputPanel.svelte"
  import ONNXRuntime from "@onnx/dispatch.ts?worker"

  const error = $state(false)

  $effect(() => {
    const onnxRuntime = new ONNXRuntime()
    onnxRuntime.onmessage = (event) => {
      console.log("Received from ONNXRuntime:", event.data)
    }

    const modelURL = `${import.meta.env.VITE_PUBLIC_URL}/${import.meta.env.VITE_MODEL_NAME}`
    try {
      onnxRuntime.postMessage({ modelURL })
    } catch (error) {
      error = true
    }
  })
</script>

<main class="bg-slate-700 grid place-content-center h-screen">
  <DigitInputPanel />
</main>
