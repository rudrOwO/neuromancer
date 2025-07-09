<script lang="ts">
  import { Canvas } from "@threlte/core"
  import MNIST from "@components/3d/MNIST.svelte"
  import type { InferenceResponse } from "bridge"
  import Hint from "@components/Hint.svelte"
  import Modal from "@components/infographics/Modal.svelte"
  import { isFirstVisit } from "@utils/firstvisit"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    inferenceResponse: InferenceResponse
  }

  const { inputTensorDimension, inputTensorData, inferenceResponse }: Props =
    $props()

  let showHint = $state(isFirstVisit)

  function handlePointerDown() {
    showHint = false
  }
</script>

<div
  class="w-full h-full"
  role="none"
  onmousedown={handlePointerDown}
  ontouchstart={handlePointerDown}
>
  <Modal />
  <div
    class="fixed flex w-dvw text-text-color z-100 justify-center items-center top-16 left-16"
  >
    {#if showHint}
      <Hint
        iconSrc="/mouse-icon.svg"
        message="<p>✨New✨<br>Drag, zoom, <b>click</b></p>"
      />
    {/if}
  </div>
  <Canvas>
    <MNIST {inputTensorDimension} {inputTensorData} {inferenceResponse} />
  </Canvas>
</div>
