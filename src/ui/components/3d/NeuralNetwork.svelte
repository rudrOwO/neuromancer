<script lang="ts">
  import { Canvas } from "@threlte/core"
  import MNIST from "@components/3d/MNIST.svelte"
  import type { InferenceResponse } from "bridge"
  import Hint from "@components/Hint.svelte"
  import Modal from "@components/infographics/Modal.svelte"
  import { isFirstVisit } from "@utils/firstvisit"
  import { pointerDraggingState } from "@sharedstate/dragging.svelte"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    inferenceResponse: InferenceResponse
  }

  const { inputTensorDimension, inputTensorData, inferenceResponse }: Props =
    $props()

  let showHint = $state(isFirstVisit)
  let timeoutId: any
  const draggingDelay = 100

  function handlePointerDown() {
    showHint = false
    // using delay to prevent race condition with click handler
    timeoutId = setTimeout(
      () => (pointerDraggingState.isDragging = true),
      draggingDelay,
    )
  }

  function handlePointerRelease() {
    clearTimeout(timeoutId)
    // using delay to allow the click handler to finish executing with correct state (isPointerDragging)
    setTimeout(() => (pointerDraggingState.isDragging = false), draggingDelay)
  }
</script>

<div
  class="w-full h-full"
  role="none"
  onpointerup={handlePointerRelease}
  onmousedown={handlePointerDown}
  ontouchstart={handlePointerDown}
>
  <Modal />
  <div
    class="fixed flex w-dvw text-text-color justify-center items-center top-16"
  >
    {#if showHint}
      <Hint iconSrc="/mouse-icon.svg" message="Drag, zoom, click" />
    {/if}
  </div>
  <Canvas>
    <MNIST {inputTensorDimension} {inputTensorData} {inferenceResponse} />
  </Canvas>
</div>
