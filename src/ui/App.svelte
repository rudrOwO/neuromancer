<script lang="ts">
  import DigitInputPanel from "@components/DigitInputPanel.svelte"
  import OutputPanel from "@components/OutputPanel.svelte"
  import type { InferenceResponse } from "bridge"
  import { initializeModel } from "bridge"
  import { INPUT_TENSOR_DIMENSION, MODEL_URL } from "ui/constants/mnist"

  let isError = $state(false)
  let isInitializing = $state(true)

  let inferenceResponse = $state<InferenceResponse | null>(null)

  $effect(() => {
    if (!isInitializing) {
      console.log("Model Initialzed")
    }
  })

  $effect(() => {
    initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)
      .then((_) => {
        isInitializing = false
      })
      .catch((_) => {
        isError = true
      })
  })
</script>

<main class="bg-background h-screen">
  <!-- TODO  Add Loading and Error screens -->
  <div class="flex flex-col justify-evenly fixed top-1/2 -translate-y-1/2 ml-4">
    <DigitInputPanel bind:inferenceResponse />
    <OutputPanel {inferenceResponse} />
  </div>
</main>
