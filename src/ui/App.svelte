<script lang="ts">
  import DigitInputPanel from "@components/DigitInputPanel.svelte"
  import OutputPanel from "@components/OutputPanel.svelte"
  import type { InferenceResponse } from "bridge"
  import { initializeModel } from "bridge"
  import { INPUT_TENSOR_DIMENSION, MODEL_URL } from "ui/constants/mnist"

  let inferenceResponse = $state<InferenceResponse | null>(null)
</script>

<main class="bg-background h-screen">
  {#await initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)}
    {@render placeholder("Initiliazing Model...")}
  {:then}
    <div
      class="flex flex-col justify-evenly fixed top-1/2 -translate-y-1/2 ml-4"
    >
      <DigitInputPanel bind:inferenceResponse />
      <OutputPanel {inferenceResponse} />
    </div>
  {:catch error}
    {@render placeholder(`Something went wrong: ${error.message}`)}
  {/await}
</main>

{#snippet placeholder(message: string)}
  <p class="text-secondary text-4xl">{message}</p>
{/snippet}
