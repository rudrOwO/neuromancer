<script lang="ts">
  import {
    CAMERA_FOV,
    DEFAULT_CAMERA_POSITION,
    DISTANCE_BETWEEN_TENSORS,
    GRID_POSITION,
    GRID_SECTION_COLOR,
    GRID_SECTION_SIZE,
    GRID_SECTION_THICKNESS,
  } from "@constants/graphics"
  import { T } from "@threlte/core"
  import { Grid, OrbitControls, interactivity } from "@threlte/extras"
  import type { InferenceResponse } from "bridge"
  import InferenceFlow from "./InferenceFlow.svelte"
  import TensorGrid from "./TensorGrid.svelte"

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

<T.PerspectiveCamera
  makeDefault
  position={DEFAULT_CAMERA_POSITION}
  fov={CAMERA_FOV}
>
  <OrbitControls
    enableDamping
    maxPolarAngle={Math.PI / 2}
    minAzimuthAngle={-Math.PI / 3}
    maxAzimuthAngle={Math.PI / 3}
  />
</T.PerspectiveCamera>

<TensorGrid
  z={2 * DISTANCE_BETWEEN_TENSORS}
  layerName="Input"
  dimension={inputTensorDimension}
  activationMaps={[inputTensorData]}
  numberOfColumns={1}
  pointSize={6}
  gap={0}
  previousOutputNode={null}
/>

<TensorGrid
  z={DISTANCE_BETWEEN_TENSORS}
  layerName="Convolution Layer #1"
  {...inferenceResponse.orderedOutputNodes[0]}
  numberOfColumns={4}
  pointSize={6}
  gap={60}
  previousOutputNode={{
    activationMaps: [inputTensorData],
    dimension: inputTensorDimension,
  }}
/>

<TensorGrid
  z={0}
  layerName="Max Pool #1"
  {...inferenceResponse.orderedOutputNodes[1]}
  numberOfColumns={4}
  pointSize={8}
  gap={50}
  previousOutputNode={inferenceResponse.orderedOutputNodes[0]}
/>

<TensorGrid
  z={-DISTANCE_BETWEEN_TENSORS}
  layerName="Convolution Layer #2"
  {...inferenceResponse.orderedOutputNodes[2]}
  numberOfColumns={4}
  pointSize={8}
  gap={40}
  previousOutputNode={inferenceResponse.orderedOutputNodes[1]}
/>

<TensorGrid
  z={-2 * DISTANCE_BETWEEN_TENSORS}
  layerName="Max Pool #2"
  {...inferenceResponse.orderedOutputNodes[3]}
  numberOfColumns={4}
  pointSize={16}
  gap={40}
  previousOutputNode={inferenceResponse.orderedOutputNodes[2]}
/>

<InferenceFlow />

<Grid
  position={GRID_POSITION}
  infiniteGrid
  sectionColor={GRID_SECTION_COLOR}
  sectionThickness={GRID_SECTION_THICKNESS}
  sectionSize={GRID_SECTION_SIZE}
  fadeDistance={DEFAULT_CAMERA_POSITION[2] * 3}
/>
