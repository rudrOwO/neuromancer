<script lang="ts">
  import DigitCanvas from "@components/DigitCanvas.svelte"
  import OutputPanel from "@components/OutputPanel.svelte"
  import type { InferenceResponse } from "bridge"
  import { initializeModel } from "bridge"
  import { INPUT_TENSOR_DIMENSION, MODEL_URL } from "ui/constants/mnist"
  import NeuralNetwork from "@3d/NeuralNetwork.svelte"
  import { Canvas } from "@threlte/core"

  let inferenceResponse = $state<InferenceResponse | null>(null)
  let renderTensorData = $state<Float32Array | null>(null)
</script>

<main class="bg-black h-screen flex">
  {#await initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)}
    {@render placeholder("Initiliazing Model...")}
  {:then}
    <OutputPanel {inferenceResponse} />
    <DigitCanvas bind:inferenceResponse bind:renderTensorData />
    <Canvas>
      <NeuralNetwork />
    </Canvas>
  {:catch error}
    {@render placeholder(`Something went wrong: ${error.message}`)}
  {/await}
</main>

{#snippet placeholder(message: string)}
  <p class="fixed grid place-items-center inset-0 text-text-color text-4xl">
    <span>{message}</span>
  </p>
{/snippet}
