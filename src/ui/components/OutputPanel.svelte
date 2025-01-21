<script lang="ts">
  import { softmax } from "@utils/math"
  import type { InferenceResponse } from "shared/bridge"
  import { FINAL_NODE } from "shared/constants/mnist"
  import PanelTitle from "@components/PanelTitle.svelte"

  type Props = {
    inferenceResponse: InferenceResponse | null
  }

  let { inferenceResponse }: Props = $props()

  let predictions = $derived.by(function postProces() {
    if (inferenceResponse == null) {
      return null
    }

    return softmax(
      Array.from(inferenceResponse.outputNodes[FINAL_NODE].tensorData),
    )
      .map((prediction, index) => ({
        prediction,
        render: `${index}: ${(prediction * 100).toFixed(2)}%`,
      }))
      .sort((a, b) => {
        return b.prediction - a.prediction
      })
  })
</script>

{#snippet prediction(render: string)}
  <div class="py-1 text-xl text-secondary">{render}</div>
{/snippet}

<div class="bg-primary flex-col rounded-lg mt-6">
  <PanelTitle title="Digit Classification"></PanelTitle>
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
