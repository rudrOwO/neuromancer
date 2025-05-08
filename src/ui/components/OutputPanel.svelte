<script lang="ts">
  import type { InferenceResponse } from "bridge"
  import PredictionBar from "@components/PredictionBar.svelte"
  import Hint from "./Hint.svelte"

  type Props = {
    inferenceResponse: InferenceResponse
    showHint: boolean
  }

  const { inferenceResponse, showHint }: Props = $props()

  const predictions = $derived(
    inferenceResponse.predictions.map((prediction) =>
      (prediction * 100).toFixed(0),
    ),
  )
</script>

<div class="flex flex-col left-2 sm:left-4 fixed z-100 h-[95%] self-center">
  {#if showHint}
    <Hint iconSrc="brain-icon.svg" message="Predictions" />
  {:else}
    <img class="h-8 w-full mb-2" src="brain-icon.svg" alt="Pen Icon" />
  {/if}

  <div
    class="flex flex-col bg-background w-9 mt-2 sm:w-12 h-full rounded-lg overflow-hidden"
  >
    {#each predictions as p, index}
      <PredictionBar label={index} flexValue={p} />
    {/each}
  </div>
</div>
