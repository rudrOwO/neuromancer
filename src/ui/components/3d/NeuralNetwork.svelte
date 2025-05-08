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

  function handleMouseDown() {
    showHint = false
  }

  const { inputTensorDimension, inputTensorData, inferenceResponse }: Props =
    $props()
</script>

<div
  class="w-full h-full cursor-grab active:cursor-grabbing"
  role="none"
  onmousedown={handleMouseDown}
>
  <div
    class="fixed flex w-dvw text-text-color justify-center items-center top-16"
  >
    {#if showHint}
      <Hint iconSrc="/mouse-icon.svg" message="Drag and zoom" />
    {/if}
  </div>
  <Canvas>
    <MNIST {inputTensorDimension} {inputTensorData} {inferenceResponse} />
  </Canvas>
</div>
