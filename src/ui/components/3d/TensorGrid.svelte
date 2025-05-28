<script lang="ts">
  import type { OutputNode } from "bridge"
  import Tensor2D from "@3d/Tensor2D.svelte"
  import { Text, Align } from "@threlte/extras"
  import {
    TENSOR_FONT_SIZE,
    TENSOR_ZOOM_CONSTANT,
    TEXT_COLOR,
  } from "@constants/global"

  type Props = OutputNode & {
    layerName: string
    z: number
    numberOfColumns: number
    gap: number
    pointSize: number
  }

  let {
    layerName,
    pointSize,
    numberOfColumns,
    gap,
    dimension,
    activationMaps,
    z,
  }: Props = $props()

  const tensorWidth = dimension[2] * TENSOR_ZOOM_CONSTANT * pointSize

  // Calculate midpoint for rendering ActivationMap's name
  // because <Align> isn't working for <Text> 🤷
  const rightBound = gap * (numberOfColumns / 2)
  const leftBound = gap * (numberOfColumns / 2 - 1) + tensorWidth
  const midPoint = rightBound + (leftBound - rightBound) / 2
</script>

<Align x={0} y={0} z={false}>
  <Text
    position={[midPoint, 3, z]}
    text={layerName}
    color={TEXT_COLOR}
    fontSize={TENSOR_FONT_SIZE}
    anchorX="center"
    anchorY="bottom"
  />
  {#each activationMaps as map, i}
    <Tensor2D
      {layerName}
      position={[
        gap * (i % numberOfColumns),
        -gap * Math.floor(i / numberOfColumns),
        z,
      ]}
      {pointSize}
      rows={dimension[2]}
      columns={dimension[3]}
      tensorData={map}
    />
  {/each}
</Align>
