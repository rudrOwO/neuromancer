<script lang="ts">
  import { isFirstVisit } from "@utils/firstvisit"
  import DigitCanvas from "@components/DigitCanvas.svelte"
  import MobileOutputPanel from "@components/output/Mobile.svelte"
  import type { InferenceResponse } from "bridge"
  import { initializeModel } from "bridge"
  import {
    INPUT_TENSOR_DIMENSION,
    MODEL_URL,
    ACTIVATION_MAPS_DEFAULT_VALUE,
    INPUT_TENSOR_DEFAULT_VALUE,
  } from "@constants/mnist"
  import { checkIfDesktop, mediaQuery } from "@utils/mediaquery"
  import DesktopOutputPanel from "@components/output/Desktop.svelte"

  // lazy import to parallelize network requests
  const neuralNetworkImport = import("@components/3d/NeuralNetwork.svelte")

  let showHint = $state(isFirstVisit)
  let inferenceResponse = $state<InferenceResponse>(
    ACTIVATION_MAPS_DEFAULT_VALUE,
  )
  let inputTensorData = $state<Float32Array>(INPUT_TENSOR_DEFAULT_VALUE)
  let isDesktop = $state(false)

  $effect(() => {
    isDesktop = checkIfDesktop(mediaQuery as unknown as MediaQueryListEvent)
    mediaQuery.addEventListener("change", (ev: MediaQueryListEvent) => {
      isDesktop = checkIfDesktop(ev)
    })
  })
</script>

<main class="bg-black h-svh flex">
  {#await initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)}
    {@render placeholder("Initiliazing Model...")}
  {:then}
    {#await neuralNetworkImport}
      {@render placeholder("Loading 3D assets...")}
    {:then { default: NeuralNetwork }}
      {#if isDesktop}
        <DesktopOutputPanel {showHint} {inferenceResponse} />
      {:else}
        <MobileOutputPanel {inferenceResponse} {showHint} />
      {/if}
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
