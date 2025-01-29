<script lang="ts">
  import type { InferenceResponse } from "bridge"

  type Props = {
    inferenceResponse: InferenceResponse | null
  }

  const { inferenceResponse }: Props = $props()

  // let isMobile = $state(false)
  //
  // const updateScreenSize = () => {
  //   isMobile = window.matchMedia("(max-width: 360px)").matches
  // }
  //
  // $effect(() => {
  //   updateScreenSize()
  //   window.addEventListener("resize", updateScreenSize)
  //   return () => window.removeEventListener("resize", updateScreenSize)
  // })

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

<div class="bg-background w-[40px] h-screen mr-[10px] flex-col rounded-lg">
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
