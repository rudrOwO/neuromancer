<script lang="ts">
  import { T } from "@threlte/core"
  import { Grid, OrbitControls } from "@threlte/extras"
  import type { InferenceResponse } from "bridge"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    inferenceResponse: InferenceResponse
  }

  const { inferenceResponse }: Props = $props()
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 400]} fov={60}>
  <OrbitControls enableDamping>
    <Gizmo placement="top-right" size={150} />
  </OrbitControls>
</T.PerspectiveCamera>

<Grid
  infiniteGrid
  sectionColor="#4a4b4a"
  sectionSize={20}
  cellSize={10}
  fadeDistance={250}
/>

<T.AmbientLight color="#fff" intensity={0.4} />
<!-- <T.DirectionalLight position={[0, 200, 200]} intensity={2} color="#fff" /> -->
<!-- <T.DirectionalLight position={[0, 200, -200]} color="#fff" intensity={2} /> -->
