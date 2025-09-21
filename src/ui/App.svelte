<script lang="ts">
  import DigitCanvas from "@components/DigitCanvas.svelte"
  import Error from "@components/Error.svelte"
  import Footer from "@components/Footer.svelte"
  import Header from "@components/Header.svelte"
  import Loading from "@components/Loading.svelte"
  import Output from "@components/output/Output.svelte"
  import {
    INPUT_TENSOR_DEFAULT_VALUE,
    INPUT_TENSOR_DIMENSION,
    MODEL_URL,
  } from "@constants/mnist"
  import { isFirstVisit } from "@utils/firstvisit"
  import { initializeModel } from "bridge"

  // dynamic import for code-splitting (quicker first contentful paint)
  const neuralNetworkImport = import("@components/NeuralNetwork.svelte")

  let showHint = $state(isFirstVisit)
  let inputTensorData = $state<Float32Array>(INPUT_TENSOR_DEFAULT_VALUE)
</script>

<Header />
<main class="bg-black h-svh">
  {#await initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)}
    <Loading message="Loading Runtime..." />
  {:then}
    {#await neuralNetworkImport}
      <Loading message="Loading 3D Assets..." />
    {:then { default: NeuralNetwork }}
      <Output {showHint} />
      <DigitCanvas bind:inputTensorData bind:showHint />
      <NeuralNetwork
        inputTensorDimension={INPUT_TENSOR_DIMENSION}
        {inputTensorData}
      />
    {:catch}
      <Error message="Error: could not load 3D assets" />
    {/await}
  {:catch}
    <Error message="Could not initialize model" />
  {/await}
</main>
<Footer />
