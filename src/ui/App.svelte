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
  import Loading from "@components/Loading.svelte"
  import Error from "@components/Error.svelte"
  import Header from "@components/Header.svelte"
  import Footer from "@components/Footer.svelte"

  // lazy import to parallelize network requests
  const neuralNetworkImport = import("@components/3d/NeuralNetwork.svelte")

  let showHint = $state(isFirstVisit)
  let inferenceResponse = $state<InferenceResponse>(
    ACTIVATION_MAPS_DEFAULT_VALUE,
  )
  let inputTensorData = $state<Float32Array>(INPUT_TENSOR_DEFAULT_VALUE)
  let isDesktop = $state(
    checkIfDesktop(mediaQuery as unknown as MediaQueryListEvent),
  )

  $effect(() => {
    mediaQuery.addEventListener("change", (ev: MediaQueryListEvent) => {
      isDesktop = checkIfDesktop(ev)
    })
  })
</script>

<Header />
<main class="bg-black h-svh">
  {#await initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)}
    <Loading message="Loading Runtime..." />
  {:then}
    {#await neuralNetworkImport}
      <Loading message="Loading 3D Assets..." />
    {:then { default: NeuralNetwork }}
      {#if isDesktop}
        <DesktopOutputPanel {showHint} {inferenceResponse} />
      {:else}
        <MobileOutputPanel {inferenceResponse} {showHint} />
      {/if}
      <DigitCanvas
        bind:inferenceResponse
        bind:inputTensorData
        bind:showHint
        {isDesktop}
      />
      <NeuralNetwork
        inputTensorDimension={INPUT_TENSOR_DIMENSION}
        {inputTensorData}
        {inferenceResponse}
      />
    {:catch _}
      <Error message="Error: could not load 3D assets" />
    {/await}
  {:catch _}
    <Error message="Could not initialize model" />
  {/await}
</main>
<Footer {isDesktop} />
