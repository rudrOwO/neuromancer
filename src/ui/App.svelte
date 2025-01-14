<script lang="ts">
  import DigitInputPanel from "@components/DigitInputPanel.svelte"
  import { modelURL } from "@onnx/mnist/constants"
  import { initializeModel, runModel } from "bridge"

  let isError = $state(false)
  let isInitializing = $state(true)

  $effect(function () {
    if (!isInitializing) {
      console.log("Model Initialzed")

      // const dims = [1, 1, 28, 28]
      // const size = dims.reduce((a, b) => a * b)
      //
      // runModel(new Float32Array(size)).then((response) => {
      //   console.log(response)
      // })
    }
  })

  $effect(function initModel() {
    initializeModel(modelURL)
      .then((_) => {
        isInitializing = false
      })
      .catch((_) => {
        isError = true
      })
  })
</script>

<main class="bg-slate-700 grid place-content-center h-screen">
  <DigitInputPanel />
</main>
