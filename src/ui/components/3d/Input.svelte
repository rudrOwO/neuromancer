<script lang="ts">
  import { Text, Align, interactivity, useCursor } from "@threlte/extras"
  import Tensor2D from "@3d/Tensor2D.svelte"
  import { TENSOR_FONT_SIZE, TENSOR_ZOOM_CONSTANT } from "@constants/global"
  import { T } from "@threlte/core"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    pointSize: number
    z: number
  }

  const { inputTensorDimension, inputTensorData, pointSize, z }: Props =
    $props()
  const tensorWidth = inputTensorDimension[2] * TENSOR_ZOOM_CONSTANT * pointSize
  const tensorHeight =
    inputTensorDimension[3] * TENSOR_ZOOM_CONSTANT * pointSize
  const midPoint = tensorWidth / 2

  let textColor = $state("gray")
  let fontSize = $state(TENSOR_FONT_SIZE)

  interactivity()
  const { onPointerEnter, onPointerLeave } = useCursor()
  function handleClick() {
    console.log(`Input clicked`)
  }

  function handlePointerEnter() {
    onPointerEnter()
    textColor = "white"
    fontSize = fontSize + 1
  }

  function handlePointerLeave() {
    onPointerLeave()
    textColor = "gray"
    fontSize = fontSize - 1
  }
</script>

<Align x={0} y={0} z={false}>
  <Text
    position={[midPoint, 3, z]}
    text="Input"
    color={textColor}
    {fontSize}
    anchorX="center"
    anchorY="bottom"
  />
  <Tensor2D
    position={[0, 0, z]}
    {pointSize}
    rows={inputTensorDimension[2]}
    columns={inputTensorDimension[3]}
    tensorData={inputTensorData}
  />
  <T.Mesh
    position={[tensorWidth / 2, -tensorHeight / 2, z - 2]}
    onclick={handleClick}
    onpointerenter={handlePointerEnter}
    onpointerleave={handlePointerLeave}
  >
    <T.PlaneGeometry args={[tensorWidth, tensorHeight]} />
    <T.MeshBasicMaterial
      args={[
        {
          color: 0x000000,
          side: 2,
          transparent: true,
          opacity: 0.5,
        },
      ]}
    />
  </T.Mesh>
</Align>
