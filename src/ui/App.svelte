<script lang="ts">
  import Button from "@components/Button.svelte"
  import DigitInputPanel from "@components/DigitInputPanel.svelte"
  import OutputPanel from "@components/OutputPanel.svelte"
  import type { InferenceResponse } from "bridge"
  import { initializeModel } from "bridge"
  import { INPUT_TENSOR_DIMENSION, MODEL_URL } from "ui/constants/mnist"

  let inferenceResponse = $state<InferenceResponse | null>(null)
  let renderTensorData = $state<Float32Array | null>(null)
  let isUIVisible = $state(true)
  let isMobile = $state(false)

  const updateScreenSize = () => {
    isMobile = window.matchMedia("(max-width: 640px)").matches
  }

  const toggleUI = () => {
    isUIVisible = !isUIVisible
  }

  $effect(() => {
    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  })
</script>

<main class="bg-black h-screen flex">
  {#await initializeModel(MODEL_URL, INPUT_TENSOR_DIMENSION)}
    {@render placeholder("Initiliazing Model...")}
  {:then}
    <div
      class="left-0 right-0 sm:right-auto flex flex-col fixed sm:relative h-screen justify-start items-center py-2 mx-4 top-1/2 -translate-y-1/2"
    >
      {#if isUIVisible}
        {#if isMobile}
          <Button
            onclick={toggleUI}
            iconSrc="/hide-icon.svg"
            altText="Hide UI"
            text="Hide UI"
            color="bg-hidden"
          />
        {/if}
        <DigitInputPanel bind:inferenceResponse bind:renderTensorData />
        <OutputPanel {inferenceResponse} {isMobile} />
      {:else}
        <Button
          onclick={toggleUI}
          iconSrc="/pen-icon.svg"
          altText="Draw a digit"
          text="Draw a digit"
          color="bg-accent"
        />
      {/if}
    </div>
  {:catch error}
    {@render placeholder(`Something went wrong: ${error.message}`)}
  {/await}
  <!-- NOTE This is target for 3D rendering -->
  <div class="w-full h-full bg-black"></div>
</main>

{#snippet placeholder(message: string)}
  <p class="fixed grid place-items-center inset-0 text-text-color text-4xl">
    <span>{message}</span>
  </p>
{/snippet}
