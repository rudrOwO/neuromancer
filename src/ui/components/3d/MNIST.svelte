<script lang="ts">
  import { T } from "@threlte/core"
  import { Grid, OrbitControls } from "@threlte/extras"
  import type { InferenceResponse } from "bridge"

  type Props = {
    inferenceResponse: InferenceResponse | null
  }

  const { inferenceResponse }: Props = $props()
</script>

<T.PerspectiveCamera makeDefault position={[0, 100, 200]} fov={60}>
  <OrbitControls enableDamping />
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
