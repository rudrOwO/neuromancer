<script lang="ts">
  import DigitInputPanel from "@components/DigitInputPanel.svelte"
  import { softmax } from "@utils/math"
  import type { InferenceResponse } from "shared/bridge"
  import { initializeModel } from "shared/bridge"
  import {
    FINAL_NODE,
    INPUT_TENSOR_DIMENSION,
    MODEL_URL,
  } from "shared/constants/mnist"

  let isError = $state(false)
  let isInitializing = $state(true)

  let inferenceResponse = $state<InferenceResponse | null>(null)
  let prediction = $derived.by(function postProcess() {
    if (inferenceResponse != null) {
      return softmax(
        Array.from(inferenceResponse.outputNodes[FINAL_NODE].tensorData),
      )
    } else {
      return null
    }
  })

  // DEBUG   Logger
  $effect(function log() {
    prediction?.map((value, index) => {
      console.log(`${index}: ${value}`)
    })
  })

  $effect(function ready() {
    if (!isInitializing) {
      console.log("Model Initialzed")
    }
  })

  $effect(function init() {
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
  <DigitInputPanel bind:inferenceResponse />
</main>
