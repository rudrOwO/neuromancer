<script lang="ts">
  import type { InferenceResponse } from "bridge"

  type Props = {
    inferenceResponse: InferenceResponse | null
  }

  let { inferenceResponse }: Props = $props()

  let predictions = $derived.by(() => {
    if (inferenceResponse == null) {
      return null
    }

    return inferenceResponse.predictions
      .map((prediction, index) => ({
        prediction,
        render: `${index}: ${(prediction * 100).toFixed(2)}%`,
      }))
      .sort((a, b) => {
        return b.prediction - a.prediction
      })
  })
</script>

<div class="bg-background w-[300px] flex-col sm:rounded-lg sm:mt-6">
  <div
    class="w-full text-center text-text-color text-2xl p-2 bg-accent rounded-lg shadow-xl"
  >
    Digit Classification
  </div>

  <div class="p-2">
    {#if predictions == null}
      {#each new Array(10) as _, index}
        {@render prediction(`${index}:`)}
      {/each}
    {:else}
      {#each predictions as p}
        {@render prediction(p.render)}
      {/each}
    {/if}
  </div>
</div>

{#snippet prediction(render: string)}
  <div class="py-1 text-xl text-text-color">{render}</div>
{/snippet}
