<script lang="ts">
  import { T } from "@threlte/core"
  import { OrbitControls } from "@threlte/extras"
  import type { InferenceResponse } from "bridge"
  import ActivationMap from "@3d/ActivationMap.svelte"
  import { AMBIENT_LIGHT_INTENSITY } from "@constants/global"
  import Input from "@3d/Input.svelte"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    inferenceResponse: InferenceResponse
  }

  const { inputTensorDimension, inputTensorData, inferenceResponse }: Props =
    $props()
</script>

<T.PerspectiveCamera makeDefault position={[375, 275, 375]} fov={25}>
  <OrbitControls enableDamping></OrbitControls>
</T.PerspectiveCamera>

<T.AmbientLight color="#fff" intensity={AMBIENT_LIGHT_INTENSITY} />

<Input {inputTensorDimension} {inputTensorData} pointSize={6} z={120} />

<ActivationMap
  z={0}
  name="Convolution Layer #1"
  {...inferenceResponse.orderedOutputNodes[0]}
  numberOfColumns={4}
  pointSize={8}
  gap={50}
/>

<ActivationMap
  z={-120}
  name="Convolution Layer #2"
  {...inferenceResponse.orderedOutputNodes[1]}
  numberOfColumns={4}
  pointSize={12}
  gap={40}
/>
