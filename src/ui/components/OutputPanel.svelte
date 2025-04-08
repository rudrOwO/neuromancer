<script lang="ts">
  import type { InferenceResponse } from "bridge"
  import PredictionBar from "@components/PredictionBar.svelte"

  type Props = {
    inferenceResponse: InferenceResponse
  }

  const { inferenceResponse }: Props = $props()

  const predictions = $derived(
    inferenceResponse.predictions.map((prediction) =>
      (prediction * 100).toFixed(0),
    ),
  )
</script>

<div
  class="flex flex-col fixed bg-background w-9 sm:w-12 h-[95%] self-center ml-2 rounded-lg overflow-hidden z-100"
>
  {#each predictions as p, index}
    <PredictionBar label={index} flexValue={p} />
  {/each}
</div>
