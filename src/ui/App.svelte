<script lang="ts">
  import DigitCanvas from "@components/DigitCanvas.svelte"
  import Error from "@components/Error.svelte"
  import Footer from "@components/Footer.svelte"
  import Header from "@components/Header.svelte"
  import Loading from "@components/Loading.svelte"
  import Output from "@components/output/Output.svelte"
  import {
    ACTIVATION_MAPS_DEFAULT_VALUE,
    INPUT_TENSOR_DEFAULT_VALUE,
    INPUT_TENSOR_DIMENSION,
    MODEL_URL,
  } from "@constants/mnist"
  import { isFirstVisit } from "@utils/firstvisit"
  import { checkIfDesktop, mediaQuery } from "@utils/mediaquery"
  import { type InferenceResponse, initializeModel } from "bridge"

  // lazy import to parallelize network requests
  const neuralNetworkImport = import("@components/NeuralNetwork.svelte")

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
      <Output {isDesktop} {showHint} {inferenceResponse} />
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
    {:catch}
      <Error message="Error: could not load 3D assets" />
    {/await}
  {:catch}
    <Error message="Could not initialize model" />
  {/await}
</main>
<Footer {isDesktop} />
