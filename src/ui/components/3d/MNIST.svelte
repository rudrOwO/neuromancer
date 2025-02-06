<script lang="ts">
  import { T } from "@threlte/core"
  import { Align, Gizmo, OrbitControls } from "@threlte/extras"
  import type { InferenceResponse } from "bridge"
  import Tensor2D from "@3d/Tensor2D.svelte"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    inferenceResponse: InferenceResponse
  }

  const { inputTensorDimension, inputTensorData, inferenceResponse }: Props =
    $props()
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 200]} fov={25}>
  <OrbitControls enableDamping>
    <Gizmo placement="top-right" size={150} />
  </OrbitControls>
</T.PerspectiveCamera>

<T.AmbientLight color="#fff" intensity={1} />

<Align>
  <Tensor2D
    position={{ x: 0, y: 0, z: 0 }}
    rows={inputTensorDimension[2]}
    columns={inputTensorDimension[3]}
    tensorData={inputTensorData}
  />
</Align>
