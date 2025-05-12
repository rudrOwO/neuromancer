<script lang="ts">
  import { T } from "@threlte/core"
  import { OrbitControls } from "@threlte/extras"
  import type { InferenceResponse } from "bridge"
  import TensorGrid from "@3d/TensorGrid.svelte"
  import { AMBIENT_LIGHT_INTENSITY } from "@constants/global"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    inferenceResponse: InferenceResponse
  }

  let interactionMutexLock = $state(0)

  const { inputTensorDimension, inputTensorData, inferenceResponse }: Props =
    $props()
</script>

<T.PerspectiveCamera makeDefault position={[375, 275, 375]} fov={25}>
  <OrbitControls enableDamping></OrbitControls>
</T.PerspectiveCamera>

<T.AmbientLight color="#fff" intensity={AMBIENT_LIGHT_INTENSITY} />

<TensorGrid
  z={120}
  name="Input"
  dimension={inputTensorDimension}
  activationMaps={[inputTensorData]}
  numberOfColumns={1}
  pointSize={6}
  gap={0}
  bind:interactionMutexLock
  interactionMutexKey={0b1}
/>

<TensorGrid
  z={0}
  name="Convolution Layer #1"
  {...inferenceResponse.orderedOutputNodes[0]}
  numberOfColumns={4}
  pointSize={8}
  gap={50}
  bind:interactionMutexLock
  interactionMutexKey={0b10}
/>

<TensorGrid
  z={-120}
  name="Convolution Layer #2"
  {...inferenceResponse.orderedOutputNodes[1]}
  numberOfColumns={4}
  pointSize={12}
  gap={40}
  bind:interactionMutexLock
  interactionMutexKey={0b100}
/>
