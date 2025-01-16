<script lang="ts">
  import DigitInputPanel from "@components/DigitInputPanel.svelte"
  import { INPUT_TENSOR_DIMENSION, MODEL_URL } from "shared/constants/mnist"
  import { initializeModel, runModel } from "shared/bridge"

  let isError = $state(false)
  let isInitializing = $state(true)

  $effect(function () {
    if (!isInitializing) {
      console.log("Model Initialzed")

      const dims = [1, 1, 28, 28]
      const size = dims.reduce((a, b) => a * b)

      runModel(new Float32Array(size), INPUT_TENSOR_DIMENSION)
        .then((response) => {
          console.log(response)
        })
        .catch((e) => console.error(e))
    }
  })

  $effect(function initModel() {
    initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)
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
