<script lang="ts">
  import type { Tensor } from "@sharedstate/infographics.svelte"
  import Kernel from "./Kernel.svelte"
  import Cell from "./Cell.svelte"

  const {
    tensorData,
    rows,
    columns,
    cellSize,
    kernelStride,
    kernelDimension,
    kernelTick,
    masked,
  }: Tensor = $props()

  const rowBuffers = $derived.by(() => {
    const rowBuffers: Float32Array[] = new Array(rows)
    for (let i = 0; i < rows; i++) {
      rowBuffers[i] = tensorData.subarray(i * columns, (i + 1) * columns)
    }
    return rowBuffers
  })

  const maskMatrix = $state(new Array(rows))
  function fillMaskArray() {
    for (let i = 0; i < rows; i++) {
      const newRow = new Array(columns)
      newRow.fill(masked)
      maskMatrix[i] = newRow
    }
  }
  fillMaskArray()
  let mask_i = 0
  let mask_j = 0 // For keeping track of updates in animation iterations

  let lastTime = performance.now()
  let animationId: number
  let transformStyle = $state("")
  let row = 0
  let col = 0

  function animate(timestamp: DOMHighResTimeStamp) {
    if (timestamp - lastTime >= kernelTick) {
      lastTime = timestamp

      if (masked) {
        maskMatrix[mask_i][mask_j] = false // unmask with each animation iteration
      }

      const x = col * cellSize
      const y = row * cellSize
      transformStyle = `transform: translate(${x}rem, ${y}rem);`

      // Slide kernel to right - 1 step
      col += kernelStride
      mask_j += 1

      if (col + kernelDimension > rows) {
        // This is basically CRLF equivalent of a typwriter
        col = 0
        mask_j = 0
        row += kernelStride
        mask_i += 1
      }

      if (row + kernelDimension > columns) {
        // Reset everything once the last cell is animated
        row = 0
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

<div class="relative">
  {#each rowBuffers as rowBuffer, i}
    <div class="flex flex-row">
      {#each rowBuffer as grayValue, j}
        <Cell {grayValue} {cellSize} masked={maskMatrix[i][j]} />
      {/each}
    </div>
  {/each}
  <Kernel
    width={kernelDimension * cellSize}
    height={kernelDimension * cellSize}
    {transformStyle}
  />
</div>
