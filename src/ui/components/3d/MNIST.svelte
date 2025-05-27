<script lang="ts">
  import { T } from "@threlte/core"
  import { OrbitControls, interactivity } from "@threlte/extras"
  import type { InferenceResponse } from "bridge"
  import TensorGrid from "@3d/TensorGrid.svelte"
  import { AMBIENT_LIGHT_INTENSITY } from "@constants/global"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    inferenceResponse: InferenceResponse
  }

  let { inputTensorDimension, inputTensorData, inferenceResponse }: Props =
    $props()

  interactivity({
    filter: (hits, _) => {
      // Only return the first hit from the raycaster
      return hits.slice(0, 1)
    },
  })
</script>

<T.PerspectiveCamera makeDefault position={[375, 275, 375]} fov={25}>
  <OrbitControls enableDamping></OrbitControls>
</T.PerspectiveCamera>

<T.AmbientLight color="#fff" intensity={AMBIENT_LIGHT_INTENSITY} />

<TensorGrid
  z={110}
  name="Input"
  dimension={inputTensorDimension}
  activationMaps={[inputTensorData]}
  numberOfColumns={1}
  pointSize={6}
  gap={0}
/>

<TensorGrid
  z={0}
  name="Convolution Layer #1"
  {...inferenceResponse.orderedOutputNodes[0]}
  numberOfColumns={4}
  pointSize={8}
  gap={50}
/>

<TensorGrid
  z={-110}
  name="Convolution Layer #2"
  {...inferenceResponse.orderedOutputNodes[1]}
  numberOfColumns={4}
  pointSize={14}
  gap={40}
/>
