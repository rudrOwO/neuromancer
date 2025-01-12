<script lang="ts">
  import DigitInputPanel from "@components/DigitInputPanel.svelte"
  import { modelURL } from "@onnx/mnist/constants"
  import { initializeModel } from "bridge"

  let model: ArrayBuffer

  let isError = $state(false)
  let isLoading = $state(true)
  let isInitializing = $state(true)
  let model: ArrayBuffer

  // Can't use async function inside $effect
  $effect(function fetchModel() {
    fetch(modelURL)
      .then((response) => response.arrayBuffer())
      .then((_model) => {
        model = _model
        isLoading = false
      })
      .catch((error) => {
        console.error("Error FETCHING model", error)
        isError = true
      })
  })

  $effect(function initModel() {
    if (!isLoading) {
      initializeModel(model)
        .then((_) => {
          console.log("Model Initialzed")
          isInitializing = false
        })
        .catch((error) => {
          console.error("Error INITIALIZING model", error)
          isError = true
        })
    }
  })
</script>

<main class="bg-slate-700 grid place-content-center h-screen">
  <DigitInputPanel />
</main>
