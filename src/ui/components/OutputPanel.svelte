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

<div class="flex flex-col left-2 sm:left-4 fixed z-100 h-[95%] self-center">
  <div class="text-white text-2xl bg-background rounded-lg overflow-hidden p-2">
    Predictions
  </div>
  <div
    class="flex flex-col bg-background w-9 mt-2 sm:w-12 h-full rounded-lg overflow-hidden"
  >
    {#each predictions as p, index}
      <PredictionBar label={index} flexValue={p} />
    {/each}
  </div>
</div>
