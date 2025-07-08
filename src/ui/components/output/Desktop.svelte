<script lang="ts">
  import Hint from "@components/Hint.svelte"
  import type { InferenceResponse } from "bridge"
  import clsx from "clsx"

  type Props = {
    inferenceResponse: InferenceResponse
    showHint: boolean
  }

  const { inferenceResponse, showHint }: Props = $props()

  const predictionStrings = $derived(
    inferenceResponse.predictions.map(
      (prediction) => `${(prediction * 100).toFixed(0)}%`,
    ),
  )
</script>

<div
  class="flex flex-col items-start gap-4 top-8 left-8 fixed z-100 w-[20vw] overflow-hidden rounded-lg"
>
  {#if showHint}
    <Hint iconSrc="brain-icon.svg" message="Predictions" />
  {:else}
    <img class="h-8 mb-2" src="brain-icon.svg" alt="Pen Icon" />
  {/if}

  {#each predictionStrings as p, index}
    <div class="flex flex-row w-full rounded-lg">
      <span class=" text-2xl mr-2 text-text-color">
        {index}
      </span>
      <div
        class={clsx(
          "py-1 text-sm text-text-color grid place-items-center bg-accent-dark rounded-lg prediction-bar",
        )}
        style:width={p}
      >
        {#if p !== "10%"}
          {p}
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .prediction-bar {
    transition: width 0.3s ease-in-out;
  }
</style>
