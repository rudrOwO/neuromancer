<script lang="ts">
  import { T } from "@threlte/core"
  import { Align, Gizmo, OrbitControls } from "@threlte/extras"
  import type { InferenceResponse } from "bridge"
  import Tensor2D from "@3d/Tensor2D.svelte"
  import ActivationMap from "./ActivationMap.svelte"
  import { AMBIENT_LIGHT_INTENSITY } from "@constants/global"

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

<Align x={0} y={0} z={false}>
  <Tensor2D
    position={[0, 0, 100]}
    pointSize={6}
    rows={inputTensorDimension[2]}
    columns={inputTensorDimension[3]}
    tensorData={inputTensorData}
  />
</Align>

<ActivationMap
  z={0}
  {...inferenceResponse.orderedOutputNodes[0]}
  rowLength={4}
  pointSize={8}
  gap={50}
/>

<ActivationMap
  z={-100}
  {...inferenceResponse.orderedOutputNodes[1]}
  rowLength={4}
  pointSize={12}
  gap={40}
/>
