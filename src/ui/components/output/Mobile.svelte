<script lang="ts">
  import Hint from "@components/Hint.svelte"
  import clsx from "clsx"

  type Props = {
    predictions: Float32Array
    showHint: boolean
  }

  const { predictions, showHint }: Props = $props()

  const predictionStrings = $derived(
    Array.from(predictions).map((prediction) => (prediction * 100).toFixed(0)),
  )

  const predictionBitmap = $derived.by(function () {
    const predictionBitmap = new Array<boolean>(10)
    predictionBitmap.fill(false)

    let prediction = 0.1
    let predictionIndex = -1

    for (let i = 0; i < 10; i++) {
      // Need to add some padding because floating point precission blah blah blah
      if (predictions[i] > prediction + 0.0001) {
        prediction = predictions[i]
        predictionIndex = i
      }
    }

    if (predictionIndex != -1) {
      predictionBitmap[predictionIndex] = true
    }

    return predictionBitmap
  })
</script>

<div
  class="flex flex-col top-12 bottom-2 my-auto left-2 fixed z-100 h-[90dvh] self-center"
>
  {#if showHint}
    <Hint message="Predictions" />
  {/if}

  <div
    class="flex flex-col bg-background w-9 mt-2 sm:w-12 h-full rounded-lg overflow-hidden"
  >
    {#each predictionStrings as p, index}
      <div
        class={clsx(
          "py-1 grid place-items-center font-bold text-base sm:text-xl text-text-color prediction-bar",
          index % 2 ? "bg-background" : "bg-accent-dark",
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
