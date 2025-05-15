<script lang="ts">
  import { isFirstVisit } from "@utils/firstvisit"
  import { Canvas } from "@threlte/core"
  import MNIST from "@3d/MNIST.svelte"
  import type { InferenceResponse } from "bridge"
  import Hint from "@components/Hint.svelte"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    inferenceResponse: InferenceResponse
  }

  let showHint = $state(isFirstVisit)
  let isPointerDown = $state(false)
  let isPointerDragging = $state(false)

  function handlePointerDown() {
    isPointerDown = true
    showHint = false
  }

  function handlePointerMove() {
    if (isPointerDown) {
      isPointerDragging = true
    }
  }

  const { inputTensorDimension, inputTensorData, inferenceResponse }: Props =
    $props()
</script>

<div
  class="w-full h-full"
  role="none"
  onmousedown={handlePointerDown}
  ontouchstart={handlePointerDown}
  onmousemove={handlePointerMove}
  ontouchmove={handlePointerMove}
>
  <div
    class="fixed flex w-dvw text-text-color justify-center items-center top-16"
  >
    {#if showHint}
      <Hint iconSrc="/mouse-icon.svg" message="Drag, zoom, click" />
    {/if}
  </div>
  <Canvas>
    <MNIST
      {inputTensorDimension}
      {inputTensorData}
      {inferenceResponse}
      bind:isPointerDragging
      bind:isPointerDown
    />
  </Canvas>
</div>
