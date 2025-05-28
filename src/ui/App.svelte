<script lang="ts">
  import { isFirstVisit } from "@utils/firstvisit"
  import DigitCanvas from "@components/DigitCanvas.svelte"
  import OutputPanel from "@components/OutputPanel.svelte"
  import type { InferenceResponse } from "bridge"
  import { initializeModel } from "bridge"
  import {
    INPUT_TENSOR_DIMENSION,
    MODEL_URL,
    ACTIVATION_MAPS_DEFAULT_VALUE,
    INPUT_TENSOR_DEFAULT_VALUE,
  } from "@constants/mnist"
  const neuralNetworkImport = import("@components/3d/NeuralNetwork.svelte")

  let showHint = $state(isFirstVisit)
  let inferenceResponse = $state<InferenceResponse>(
    ACTIVATION_MAPS_DEFAULT_VALUE,
  )
  let inputTensorData = $state<Float32Array>(INPUT_TENSOR_DEFAULT_VALUE)
</script>

<main class="bg-black h-svh flex">
  {#await initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)}
    {@render placeholder("Initiliazing Model...")}
  {:then}
    {#await neuralNetworkImport}
      {@render placeholder("Loading 3D assets...")}
    {:then { default: NeuralNetwork }}
      <OutputPanel {inferenceResponse} {showHint} />
      <DigitCanvas bind:inferenceResponse bind:inputTensorData bind:showHint />
      <NeuralNetwork
        inputTensorDimension={INPUT_TENSOR_DIMENSION}
        {inputTensorData}
        {inferenceResponse}
      />
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
