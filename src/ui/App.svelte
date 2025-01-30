<script lang="ts">
  import Button from "@components/Button.svelte"
  import DigitInputPanel from "@components/DigitInputPanel.svelte"
  import OutputPanel from "@components/OutputPanel.svelte"
  import type { InferenceResponse } from "bridge"
  import { initializeModel } from "bridge"
  import { INPUT_TENSOR_DIMENSION, MODEL_URL } from "ui/constants/mnist"

  let inferenceResponse = $state<InferenceResponse | null>(null)
  let renderTensorData = $state<Float32Array | null>(null)
  let isUIVisible = $state(true)

  const toggleUI = () => {
    isUIVisible = !isUIVisible
  }
</script>

<!-- NOTE  <main> is target for 3D rendering -->
<main class="bg-black h-screen flex">
  {#await initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)}
    {@render placeholder("Initiliazing Model...")}
  {:then}
    <OutputPanel {inferenceResponse} />
    <div
      class="flex fixed right-2 bottom-[2.5vh] sm:right-6 rounded-lg overflow-hidden"
    >
      {#if isUIVisible}
        <DigitInputPanel
          bind:inferenceResponse
          bind:renderTensorData
          bind:isUIVisible
        />
      {:else}
        <div class="rounded-lg overflow-hidden max-h-min">
          <Button
            onclick={toggleUI}
            iconSrc="/canvas-icon.svg"
            altText="Show Canvas"
            text="Show Canvas"
            type="default"
          />
        </div>
      {/if}
    </div>
  {:catch error}
    {@render placeholder(`Something went wrong: ${error.message}`)}
  {/await}
</main>

{#snippet placeholder(message: string)}
  <p class="fixed grid place-items-center inset-0 text-text-color text-4xl">
    <span>{message}</span>
  </p>
{/snippet}
