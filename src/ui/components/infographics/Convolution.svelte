<script lang="ts">
  import { SVG_ARROW_OFFSET_PER_FRAME } from "@constants/graphics"
  import {
    infographicsModal,
    tensorState,
  } from "@sharedstate/infographics.svelte"
  import { initializeSVG } from "@utils/svgarrows"
  import Aggregate from "./Aggregate.svelte"
  import MaskedTensor from "./MaskedTensor.svelte"
  import UnmaskedTensor from "./UnmaskedTensor.svelte"

  const kernelTick = tensorState.unmaskedTensors[0].kernelTick
  const kernelDimension = tensorState.unmaskedTensors[0].kernelDimension

  const unmaskedTensorData = tensorState.unmaskedTensors.map(
    (ut) => ut.tensorData,
  )
  const unmaskedRows = tensorState.unmaskedTensors[0].rows
  const unmaskedColumns = tensorState.unmaskedTensors[0].columns
  const unmaskedCellSize = tensorState.unmaskedTensors[0].cellSize
  const unmaskedKernelStride = tensorState.unmaskedTensors[0].kernelStride
  let unmaskedTransformStyle = $state("")

  const maskedRows = tensorState.maskedTensor!.rows
  const maskedColumns = tensorState.maskedTensor!.columns
  const maskedCellSize = tensorState.maskedTensor!.cellSize
  const maskedKernelStride = 1 // Masked kernels always have unit stride and dimension
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
  let unmaskedRowIndex = 0
  let unmaskedColumnIndex = 0
  let maskedRowIndex = 0
  let maskedColumnIndex = 0

  const isConvolutionLayer =
    infographicsModal.layerName == "Convolution Layer #1" ||
    infographicsModal.layerName == "Convolution Layer #2"

  let svgContainer: SVGElement
  let unmaskedTensorDivs: HTMLDivElement[] = new Array(
    unmaskedTensorData.length,
  )
  let aggregateIcon: HTMLImageElement
  let maskedTensorDiv: HTMLDivElement
  const arrows: SVGLineElement[] = []
  let arrowOffset = 0
  let padding = isConvolutionLayer ? Math.round(kernelDimension / 2) : 0

  function animate(timestamp: DOMHighResTimeStamp) {
    animationId = requestAnimationFrame(animate)

    if (timestamp - lastTime < kernelTick) {
      return
    }

    lastTime = timestamp

    maskMatrix[mask_i][mask_j] = false // unmask with each animation iteration

    const unmaskedX = (unmaskedColumnIndex - padding) * unmaskedCellSize
    const unmaskedY = (unmaskedRowIndex - padding) * unmaskedCellSize
    unmaskedTransformStyle = `transform: translate(${unmaskedX}rem, ${unmaskedY}rem);`

    const maskedX = maskedColumnIndex * maskedCellSize
    const maskedY = maskedRowIndex * maskedCellSize
    maskedTransformStyle = `transform: translate(${maskedX}rem, ${maskedY}rem);`

    // Slide kernel to right - 1 step
    unmaskedColumnIndex += unmaskedKernelStride
    maskedColumnIndex += maskedKernelStride
    mask_j += 1

    if (maskedColumnIndex == maskedColumns) {
      // This is basically CRLF equivalent of a typwriter
      unmaskedColumnIndex = 0
      maskedColumnIndex = 0
      mask_j = 0

      unmaskedRowIndex += unmaskedKernelStride
      maskedRowIndex += maskedKernelStride
      mask_i += 1
    }

    if (maskedRowIndex == maskedRows) {
      // Reset everything once the last cell is animated
      unmaskedRowIndex = 0
      maskedRowIndex = 0
      mask_i = 0

      fillMaskArray()
    }

    for (const arrow of arrows) {
      arrowOffset = (arrowOffset - SVG_ARROW_OFFSET_PER_FRAME) % 60 // Resetting after 60 frames ~ 1 second
      arrow.setAttribute("stroke-dashoffset", arrowOffset.toString())
    }
  }

  $effect(() => {
    const drawArrow = initializeSVG(svgContainer)

    if (isConvolutionLayer) {
      for (const t of unmaskedTensorDivs) {
        arrows.push(drawArrow(t, aggregateIcon))
      }

      arrows.push(drawArrow(aggregateIcon, maskedTensorDiv))
    } else {
      arrows.push(drawArrow(unmaskedTensorDivs[0], maskedTensorDiv))
    }

    animationId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animationId)
    }
  })
</script>

<div class="flex flex-row relative p-2 lg:p-4">
  <div class="flex flex-col gap-6">
    {#each unmaskedTensorData as td, i}
      <UnmaskedTensor
        bind:arrowSource={unmaskedTensorDivs[i]}
        tensorData={td}
        rows={unmaskedRows}
        columns={unmaskedColumns}
        cellSize={unmaskedCellSize}
        {kernelDimension}
        transformStyle={unmaskedTransformStyle}
      ></UnmaskedTensor>
    {/each}
  </div>

  {#if isConvolutionLayer}
    <div class="w-[100px] lg:w-[220px] grid place-content-center">
      <Aggregate bind:arrowTarget={aggregateIcon} />
    </div>
  {:else}
    <div class="w-[60px] lg:w-[120px]"></div>
  {/if}

  <MaskedTensor
    bind:arrowTarget={maskedTensorDiv}
    tensorData={tensorState.maskedTensor!.tensorData}
    rows={tensorState.maskedTensor!.rows}
    columns={tensorState.maskedTensor!.columns}
    cellSize={tensorState.maskedTensor!.cellSize}
    transformStyle={maskedTransformStyle}
    {maskMatrix}
  ></MaskedTensor>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    bind:this={svgContainer}
    class="absolute inset-0 stroke-accent-light"
    width="100%"
    height="100%"
  />
</div>
