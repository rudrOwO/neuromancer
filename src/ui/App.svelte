<script lang="ts">
  import DigitInputPanel from "@components/DigitInputPanel.svelte"
  import OutputPanel from "@components/OutputPanel.svelte"
  import type { InferenceResponse } from "bridge"
  import { initializeModel } from "bridge"
  import { INPUT_TENSOR_DIMENSION, MODEL_URL } from "ui/constants/mnist"

  let inferenceResponse = $state<InferenceResponse | null>(null)
  let renderTensorData = $state<Float32Array | null>(null)
</script>

<main class="bg-black h-screen">
  {#await initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)}
    {@render placeholder("Initiliazing Model...")}
  {:then}
    <div
      class="flex flex-col justify-evenly fixed top-1/2 -translate-y-1/2 ml-4"
    >
      <DigitInputPanel bind:inferenceResponse bind:renderTensorData />
      <OutputPanel {inferenceResponse} />
    </div>
  {:catch error}
    {@render placeholder(`Something went wrong: ${error.message}`)}
  {/await}
</main>

{#snippet placeholder(message: string)}
  <p class="text-text-color text-4xl">{message}</p>
{/snippet}
