<script lang="ts">
  import {
    infographicsModal,
    tensorState,
  } from "@sharedstate/infographics.svelte"
  import UnmaskedTensor from "./UnmaskedTensor.svelte"
  import MaskedTensor from "./MaskedTensor.svelte"
  import Aggregate from "./Aggregate.svelte"
  import { initializeSVG } from "@utils/svgarrows"
  import type { Line } from "@svgdotjs/svg.js"

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

  const kernelTick = tensorState.unmaskedTensors[0].kernelTick
  let lastTime = performance.now()
  let animationId: number
  let unmaskedAnimationRow = 0
  let unmaskedAnimationColumn = 0
  let maskedAnimationRow = 0
  let maskedAnimationColumn = 0

  const renderAggregate =
    infographicsModal.layerName == "Convolution Layer #1" ||
    infographicsModal.layerName == "Convolution Layer #2"

  let svgContainer: HTMLDivElement
  let unmaskedTensorDivs: HTMLDivElement[] = new Array(
    unmaskedTensorData.length,
  )
  let aggregateIcon: HTMLImageElement
  let maskedTensorDiv: HTMLDivElement
  const arrows: Line[] = []
  let arrowOffset = 0

  function animate(timestamp: DOMHighResTimeStamp) {
    if (timestamp - lastTime >= kernelTick) {
      lastTime = timestamp

      maskMatrix[mask_i][mask_j] = false // unmask with each animation iteration

      const unmaskedX = unmaskedAnimationColumn * unmaskedCellSize
      const unmaskedY = unmaskedAnimationRow * unmaskedCellSize
      unmaskedTransformStyle = `transform: translate(${unmaskedX}rem, ${unmaskedY}rem);`

      const maskedX = maskedAnimationColumn * maskedCellSize
      const maskedY = maskedAnimationRow * maskedCellSize
      maskedTransformStyle = `transform: translate(${maskedX}rem, ${maskedY}rem);`

      // Slide kernel to right - 1 step
      unmaskedAnimationColumn += unmaskedKernelStride
      maskedAnimationColumn += maskedKernelStride
      mask_j += 1

      if (unmaskedAnimationColumn + unmaskedKernelDimension > unmaskedRows) {
        // This is basically CRLF equivalent of a typwriter
        unmaskedAnimationColumn = 0
        maskedAnimationColumn = 0
        mask_j = 0

        unmaskedAnimationRow += unmaskedKernelStride
        maskedAnimationRow += maskedKernelStride
        mask_i += 1
      }

      if (unmaskedAnimationRow + unmaskedKernelDimension > unmaskedColumns) {
        // Reset everything once the last cell is animated
        unmaskedAnimationRow = 0
        maskedAnimationRow = 0
        mask_i = 0
        fillMaskArray()
      }

      for (const arrow of arrows) {
        arrowOffset = (arrowOffset + 3) % 60
        arrow.stroke({ dashoffset: -arrowOffset })
      }
    }

    animationId = requestAnimationFrame(animate)
  }

  $effect(() => {
    const drawArrow = initializeSVG(svgContainer)

    if (renderAggregate) {
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
  <div class="flex flex-col gap-4">
    {#each unmaskedTensorData as td, i}
      <UnmaskedTensor
        bind:arrowSource={unmaskedTensorDivs[i]}
        tensorData={td}
        rows={unmaskedRows}
        columns={unmaskedColumns}
        cellSize={unmaskedCellSize}
        kernelDimension={unmaskedKernelDimension}
        transformStyle={unmaskedTransformStyle}
      ></UnmaskedTensor>
    {/each}
  </div>

  {#if renderAggregate}
    <div class="w-[100px] lg:w-[220px] grid place-content-center">
      <Aggregate bind:arrowTarget={aggregateIcon} />
    </div>
  {:else}
    <div class="w-[60px] lg:w-[120px] grid place-content-center"></div>
  {/if}

  <!-- content here -->

  <MaskedTensor
    bind:arrowTarget={maskedTensorDiv}
    tensorData={tensorState.maskedTensor!.tensorData}
    rows={tensorState.maskedTensor!.rows}
    columns={tensorState.maskedTensor!.columns}
    cellSize={tensorState.maskedTensor!.cellSize}
    transformStyle={maskedTransformStyle}
    {maskMatrix}
  ></MaskedTensor>
  <div bind:this={svgContainer} class="absolute inset-0 stroke-kernel"></div>
</div>
