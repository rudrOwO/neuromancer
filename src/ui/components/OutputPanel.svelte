<script lang="ts">
  import type { InferenceResponse } from "bridge"
  import PredictionBar from "@components/PredictionBar.svelte"

  type Props = {
    inferenceResponse: InferenceResponse | null
  }

  const { inferenceResponse }: Props = $props()

  const predictions = $derived.by(() => {
    if (inferenceResponse == null) {
      return new Array(
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
      )
    }

    return inferenceResponse.predictions.map((prediction) =>
      (prediction * 100).toFixed(0),
    )
  })
</script>

<div
  class="flex flex-col fixed bg-background w-9 sm:w-12 h-[95vh] self-center ml-2 rounded-lg overflow-hidden z-100"
>
  {#each predictions as p, index}
    <PredictionBar label={index} flexValue={p} />
  {/each}
</div>
