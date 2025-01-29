<script lang="ts">
  import type { InferenceResponse } from "bridge"
  import PanelTitle from "@components/PanelTitle.svelte"

  type Props = {
    inferenceResponse: InferenceResponse | null
    isMobile: boolean
  }

  const { inferenceResponse, isMobile }: Props = $props()

  const predictions = $derived.by(() => {
    if (inferenceResponse == null) {
      return null
    }

    const sortedList = inferenceResponse.predictions
      .map((prediction, index) => ({
        prediction,
        render: `${index}: ${(prediction * 100).toFixed(2)}%`,
      }))
      .sort((a, b) => {
        return b.prediction - a.prediction
      })

    if (isMobile) {
      return sortedList.slice(0, 3)
    } else {
      return sortedList
    }
  })
</script>

<div class="bg-background w-[300px] flex-col rounded-lg">
  <PanelTitle title="Digit Classification" />
  <div class="p-2">
    {#if predictions == null}
      {@const defaultSize = isMobile ? 3 : 10}
      {#each new Array(defaultSize) as _, index}
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
