<script lang="ts">
  import { Text, Align } from "@threlte/extras"
  import Tensor2D from "@3d/Tensor2D.svelte"
  import { TENSOR_FONT_SIZE, TENSOR_ZOOM_CONSTANT } from "@constants/global"

  type Props = {
    inputTensorDimension: number[]
    inputTensorData: Float32Array
    pointSize: number
    z: number
  }

  const { inputTensorDimension, inputTensorData, pointSize, z }: Props =
    $props()
  const tensorWidth = inputTensorDimension[2] * TENSOR_ZOOM_CONSTANT * pointSize
  const midPoint = tensorWidth / 2
</script>

<Align x={0} y={0} z={false}>
  <Text
    position={[midPoint, 3, z]}
    text="Input"
    color="lightgray"
    fontSize={TENSOR_FONT_SIZE}
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
</Align>
