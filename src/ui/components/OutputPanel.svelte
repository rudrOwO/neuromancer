<script lang="ts">
  import type { InferenceResponse } from "bridge"

  type Props = {
    inferenceResponse: InferenceResponse | null
  }

  const { inferenceResponse }: Props = $props()

  const predictions = $derived.by(() => {
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

<div
  class="flex-col fixed bg-background w-[40px] sm:w-12 h-[95vh] self-center ml-2 rounded-lg"
>
  <div class="p-2">
    {#if predictions == null}
      {#each new Array(10) as _, index}
        <!-- TODO  Give 10% to every bar -->
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
