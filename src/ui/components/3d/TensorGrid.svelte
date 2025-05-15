<script lang="ts">
  import type { OutputNode } from "bridge"
  import Tensor2D from "@3d/Tensor2D.svelte"
  import { Text, Align, useCursor } from "@threlte/extras"
  import { TENSOR_FONT_SIZE, TENSOR_ZOOM_CONSTANT } from "@constants/global"
  import { T } from "@threlte/core"

  type Props = OutputNode & {
    name: string
    z: number
    numberOfColumns: number
    gap: number
    pointSize: number
    isPointerDown: boolean
    isPointerDragging: boolean
  }

  let {
    name,
    pointSize,
    numberOfColumns,
    gap,
    dimension,
    activationMaps,
    z,
    isPointerDragging = $bindable(),
    isPointerDown = $bindable(),
  }: Props = $props()

  const numberOfRows = activationMaps.length / numberOfColumns

  const tensorWidth = dimension[2] * TENSOR_ZOOM_CONSTANT * pointSize
  const tensorHeight = dimension[3] * TENSOR_ZOOM_CONSTANT * pointSize

  // Calculate midpoint for rendering ActivationMap's name
  // because <Align> isn't working for <Text> 🤷
  const rightBound = gap * (numberOfColumns / 2)
  const leftBound = gap * (numberOfColumns / 2 - 1) + tensorWidth
  const midPoint = rightBound + (leftBound - rightBound) / 2

  const activationMapWidth = gap * (numberOfColumns - 1) + tensorWidth
  const activationMapHeight = gap * (numberOfRows - 1) + tensorHeight

  let textColor = $state("gray")

  const { onPointerEnter, onPointerLeave } = useCursor()

  function handlePointerRelease() {
    if (!isPointerDragging) {
      // TODO  Toggle modal here
      alert(`Modal Triggered for ${name}`)
    }

    isPointerDown = false
    isPointerDragging = false
  }

  function handlePointerOver() {
    onPointerEnter()
    textColor = "white"
  }

  function handlePointerOut() {
    onPointerLeave()
    textColor = "gray"
  }
</script>

<Align x={0} y={0} z={false}>
  <Text
    position={[midPoint, 3, z]}
    text={name}
    color={textColor}
    fontSize={TENSOR_FONT_SIZE}
    anchorX="center"
    anchorY="bottom"
  />
  {#each activationMaps as map, i}
    <Tensor2D
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
  <T.Mesh
    position={[activationMapWidth / 2, -activationMapHeight / 2, z - 2]}
    onpointerup={handlePointerRelease}
    onpointerover={handlePointerOver}
    onpointerout={handlePointerOut}
  >
    <T.PlaneGeometry args={[activationMapWidth, activationMapHeight]} />
    <T.MeshBasicMaterial
      args={[
        {
          color: 0x000000,
          side: 2,
          transparent: true,
          opacity: 0.6,
        },
      ]}
    />
  </T.Mesh>
</Align>
