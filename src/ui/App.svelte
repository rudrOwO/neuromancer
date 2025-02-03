<script lang="ts">
  import DigitCanvas from "@components/DigitCanvas.svelte"
  import OutputPanel from "@components/OutputPanel.svelte"
  import type { InferenceResponse } from "bridge"
  import { initializeModel } from "bridge"
  import { INPUT_TENSOR_DIMENSION, MODEL_URL } from "ui/constants/mnist"
  const neuralNetworkImport = import("@3d/NeuralNetwork.svelte")

  let inferenceResponse = $state<InferenceResponse | null>(null)
  let renderTensorData = $state<Float32Array | null>(null)
</script>

<main class="bg-black h-screen flex">
  {#await initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)}
    {@render placeholder("Initiliazing Model...")}
  {:then}
    {#await neuralNetworkImport}
      {@render placeholder("Loading 3D assets...")}
    {:then { default: NeuralNetowork }}
      <OutputPanel {inferenceResponse} />
      <DigitCanvas bind:inferenceResponse bind:renderTensorData />
      <NeuralNetowork {inferenceResponse} />
    {:catch error}
      {@render placeholder(`Could not load 3D assets: ${error.message}`)}
    {/await}
  {:catch error}
    {@render placeholder(`Could not initialize model: ${error.message}`)}
  {/await}
</main>

{#snippet placeholder(message: string)}
  <p class="fixed grid place-items-center inset-0 text-text-color text-4xl">
    <span>{message}</span>
  </p>
{/snippet}
