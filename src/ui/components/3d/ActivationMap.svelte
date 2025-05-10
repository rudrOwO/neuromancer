<script lang="ts">
  import type { OutputNode } from "bridge"
  import Tensor2D from "@3d/Tensor2D.svelte"
  import { Text, Align } from "@threlte/extras"
  import { TENSOR_FONT_SIZE, TENSOR_ZOOM_CONSTANT } from "@constants/global"

  type Props = OutputNode & {
    name: string
    z: number
    rowLength: number
    gap: number
    pointSize: number
  }

  const {
    name,
    pointSize,
    rowLength,
    gap,
    dimension,
    activationMaps,
    z,
  }: Props = $props()

  // Calculate midpoint for rendering ActivationMap's name
  // because <Align> isn't working for <Text> 🤷
  const tensorWidth = dimension[2] * TENSOR_ZOOM_CONSTANT * pointSize
  const rightBound = gap * (rowLength / 2)
  const leftBound = gap * (rowLength / 2 - 1) + tensorWidth
  const midPoint = rightBound + (leftBound - rightBound) / 2
</script>

<Align x={0} y={0} z={false}>
  <Text
    position={[midPoint, 3, z]}
    text={name}
    color="lightgray"
    fontSize={TENSOR_FONT_SIZE}
    anchorX="center"
    anchorY="bottom"
  />
  {#each activationMaps as map, i}
    <Tensor2D
      position={[gap * (i % rowLength), -gap * Math.floor(i / rowLength), z]}
      {pointSize}
      rows={dimension[2]}
      columns={dimension[3]}
      tensorData={map}
    />
  {/each}
</Align>
