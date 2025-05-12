<script lang="ts">
  import type { InferenceResponse } from "bridge"
  import PredictionBar from "@components/PredictionBar.svelte"
  import Hint from "./Hint.svelte"

  type Props = {
    inferenceResponse: InferenceResponse
    showHint: boolean
  }

  const { inferenceResponse, showHint }: Props = $props()

  const predictionStrings = $derived(
    inferenceResponse.predictions.map((prediction) =>
      (prediction * 100).toFixed(0),
    ),
  )

  const predictionBitmap = $derived.by(function () {
    const predictionBitmap = new Array(10)
    predictionBitmap.fill(false)

    let prediction = 0.1
    let predictionIndex = -1

    for (let i = 0; i < 10; i++) {
      if (inferenceResponse.predictions[i] > prediction) {
        prediction = inferenceResponse.predictions[i]
        predictionIndex = i
      }
    }

    if (predictionIndex != -1) {
      predictionBitmap[predictionIndex] = true
    }

    return predictionBitmap
  })
</script>

<div class="flex flex-col left-2 sm:left-4 fixed z-100 h-[95dvh] self-center">
  {#if showHint}
    <Hint iconSrc="brain-icon.svg" message="Predictions" />
  {:else}
    <img class="h-8 w-full mb-2" src="brain-icon.svg" alt="Pen Icon" />
  {/if}

  <div
    class="flex flex-col bg-background w-9 mt-2 sm:w-12 h-full rounded-lg overflow-hidden"
  >
    {#each predictionStrings as p, index}
      <PredictionBar
        label={index}
        flexValue={p}
        highlight={predictionBitmap[index]}
      />
    {/each}
  </div>
</div>
