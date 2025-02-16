<script lang="ts">
  import { Canvas } from "@threlte/core"
  import MNIST from "@3d/MNIST.svelte"
  import type { InferenceResponse } from "bridge"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    inferenceResponse: InferenceResponse
  }

  const { inputTensorDimension, inputTensorData, inferenceResponse }: Props =
    $props()
</script>

<div class="w-full h-full cursor-grab active:cursor-grabbing">
  <Canvas>
    <MNIST {inputTensorDimension} {inputTensorData} {inferenceResponse} />
  </Canvas>
</div>
