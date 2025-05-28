<script lang="ts">
  import { Canvas } from "@threlte/core"
  import MNIST from "@3d/MNIST.svelte"
  import type { InferenceResponse } from "bridge"
  import Hint from "@components/Hint.svelte"
  import {
    isShowHint,
    handlePointerDown,
    handlePointerRelease,
  } from "@shared/handlemouse.svelte"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    inferenceResponse: InferenceResponse
  }

  const { inputTensorDimension, inputTensorData, inferenceResponse }: Props =
    $props()
</script>

<div
  class="w-full h-full"
  role="none"
  onpointerup={handlePointerRelease}
  onmousedown={handlePointerDown}
  ontouchstart={handlePointerDown}
>
  <div
    class="fixed flex w-dvw text-text-color justify-center items-center top-16"
  >
    {#if isShowHint()}
      <Hint iconSrc="/mouse-icon.svg" message="Drag, zoom, click" />
    {/if}
  </div>
  <Canvas>
    <MNIST {inputTensorDimension} {inputTensorData} {inferenceResponse} />
  </Canvas>
</div>
