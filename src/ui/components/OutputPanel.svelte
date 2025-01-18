<script lang="ts">
  import { softmax } from "@utils/math"
  import type { InferenceResponse } from "shared/bridge"
  import { FINAL_NODE } from "shared/constants/mnist"

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

<div>
  {#if predictions == null}
    {#each new Array(10) as _, index}
      <span class="block">
        {index}:
      </span>
    {/each}
  {:else}
    {#each predictions as p}
      <span class="block">{p.render}</span>
    {/each}
  {/if}
</div>
