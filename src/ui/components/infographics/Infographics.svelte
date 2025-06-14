<script lang="ts">
  import { tensorState } from "@sharedstate/infographics.svelte"
  import UnmaskedTensor from "./UnmaskedTensor.svelte"
  import MaskedTensor from "./MaskedTensor.svelte"

  const kernelTick = tensorState.unmaskedTensors[0].kernelTick

  const unmaskedTensorData = tensorState.unmaskedTensors.map(
    (ut) => ut.tensorData,
  )
  const unmaskedRows = tensorState.unmaskedTensors[0].rows
  const unmaskedColumns = tensorState.unmaskedTensors[0].columns
  const unmaskedCellSize = tensorState.unmaskedTensors[0].cellSize
  const unmaskedKernelStride = tensorState.unmaskedTensors[0].kernelStride
  const unmaskedKernelDimension = tensorState.unmaskedTensors[0].kernelDimension
  let unmaskedTransformStyle = $state("")

  const maskedRows = tensorState.maskedTensor!.rows
  const maskedColumns = tensorState.maskedTensor!.columns
  const maskedCellSize = tensorState.maskedTensor!.cellSize
  const maskedKernelStride = tensorState.maskedTensor!.kernelStride
  let maskedTransformStyle = $state("")

  const maskMatrix = $state(new Array(maskedRows))
  function fillMaskArray() {
    for (let i = 0; i < maskedRows; i++) {
      const newRow = new Array(maskedColumns)
      newRow.fill(true)
      maskMatrix[i] = newRow
    }
  }
  fillMaskArray()
  let mask_i = 0
  let mask_j = 0 // For keeping track of updates in animation iterations

  let lastTime = performance.now()
  let animationId: number
  let unmaskedAnimationRowIndex = 0
  let unmaskedAnimationColumnIndex = 0
  let maskedAnimationRowIndex = 0
  let maskedAnimationColumnIndex = 0

  function animate(timestamp: DOMHighResTimeStamp) {
    if (timestamp - lastTime >= kernelTick) {
      lastTime = timestamp

      maskMatrix[mask_i][mask_j] = false // unmask with each animation iteration

      const unmaskedX = unmaskedAnimationColumnIndex * unmaskedCellSize
      const unmaskedY = unmaskedAnimationRowIndex * unmaskedCellSize
      unmaskedTransformStyle = `transform: translate(${unmaskedX}rem, ${unmaskedY}rem);`

      const maskedX = maskedAnimationColumnIndex * maskedCellSize
      const maskedY = maskedAnimationRowIndex * maskedCellSize
      maskedTransformStyle = `transform: translate(${maskedX}rem, ${maskedY}rem);`

      // Slide kernel to right - 1 step
      unmaskedAnimationColumnIndex += unmaskedKernelStride
      maskedAnimationColumnIndex += maskedKernelStride
      mask_j += 1

      if (
        unmaskedAnimationColumnIndex + unmaskedKernelDimension >
        unmaskedRows
      ) {
        // This is basically CRLF equivalent of a typwriter
        unmaskedAnimationColumnIndex = 0
        maskedAnimationColumnIndex = 0
        mask_j = 0

        unmaskedAnimationRowIndex += unmaskedKernelStride
        maskedAnimationRowIndex += maskedKernelStride
        mask_i += 1
      }

      if (
        unmaskedAnimationRowIndex + unmaskedKernelDimension >
        unmaskedColumns
      ) {
        // Reset everything once the last cell is animated
        unmaskedAnimationRowIndex = 0
        maskedAnimationRowIndex = 0
        mask_i = 0
        fillMaskArray()
      }
    }

    animationId = requestAnimationFrame(animate)
  }

  $effect(() => {
    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  })
</script>

<div class="flex flex-row gap-10">
  <div class="flex flex-col gap-4">
    {#each unmaskedTensorData as td}
      <UnmaskedTensor
        tensorData={td}
        rows={unmaskedRows}
        columns={unmaskedColumns}
        cellSize={unmaskedCellSize}
        kernelDimension={unmaskedKernelDimension}
        transformStyle={unmaskedTransformStyle}
      ></UnmaskedTensor>
    {/each}
  </div>

  {#if tensorState.maskedTensor != null}
    <MaskedTensor
      tensorData={tensorState.maskedTensor.tensorData}
      rows={tensorState.maskedTensor.rows}
      columns={tensorState.maskedTensor.columns}
      cellSize={tensorState.maskedTensor.cellSize}
      kernelDimension={tensorState.maskedTensor.kernelDimension}
      transformStyle={maskedTransformStyle}
      {maskMatrix}
    ></MaskedTensor>
  {/if}
</div>
