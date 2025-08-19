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

  const color = [
    "bg-accent-dark",
    "bg-background",
    "bg-accent-dark",
    "bg-background",
    "bg-accent-dark",
    "bg-background",
    "bg-accent-dark",
    "bg-background",
    "bg-accent-dark",
    "bg-background",
  ]
</script>

<div
  class="flex flex-col top-12 bottom-2 my-auto left-2 fixed z-100 h-[90dvh] self-center"
>
  {#if showHint}
    <Hint  message="Predictions" />
  {/if}

  <div
    class="flex flex-col bg-background w-9 mt-2 sm:w-12 h-full rounded-lg overflow-hidden"
  >
    {#each predictionStrings as p, index}
      <div
        class={clsx(
          "py-1 grid place-items-center font-bold text-base sm:text-xl text-text-color prediction-bar",
          color[index],
          predictionBitmap[index] && "highlight-box",
        )}
        style:flex={p}
      >
        {index}
      </div>
    {/each}
  </div>
</div>

<style>
  .prediction-bar {
    transition: flex 0.3s ease-in-out;
  }

  .highlight-box {
    border: 2px solid transparent;
    border-radius: 4px;
    animation: borderPulse 1.5s infinite ease-in-out;
  }

  /* Keyframes for border animation */
  @keyframes borderPulse {
    0%,
    100% {
      border-color: transparent;
    }
    50% {
      border-color: var(--color-gray-300);
    }
  }
</style>
