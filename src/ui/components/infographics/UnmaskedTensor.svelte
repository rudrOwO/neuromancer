<script lang="ts">
  import type { Tensor } from "@sharedstate/infographics.svelte"
  import Kernel from "./Kernel.svelte"

  const {
    tensorData,
    rows,
    columns,
    cellSize,
    kernelStride,
    kernelDimension,
    kernelTick,
  }: Tensor = $props()
  const rowBuffers = $derived.by(() => {
    const rowBuffers: Float32Array[] = new Array(rows)
    for (let i = 0; i < rows; i++) {
      rowBuffers[i] = tensorData.subarray(i * columns, (i + 1) * columns)
    }
    return rowBuffers
  })

  function brightnessToGrayscale(brightness: number) {
    const gray = Math.round(brightness * 255)
    return `rgb(${gray}, ${gray}, ${gray})`
  }

  let lastTime = performance.now()
  let animationId: number
  let transformStyle = $state("")
  let row = 0
  let col = 0

  function animate(timestamp: DOMHighResTimeStamp) {
    if (timestamp - lastTime >= kernelTick) {
      lastTime = timestamp

      const x = col * cellSize
      const y = row * cellSize
      transformStyle = `transform: translate(${x}rem, ${y}rem);`

      col += kernelStride
      if (col + kernelDimension > rows) {
        col = 0
        row += kernelStride
      }
      if (row + kernelDimension > columns) {
        row = 0
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
  {#each rowBuffers as rowBuffer}
    <div class="flex flex-row">
      {#each rowBuffer as grayValue}
        <div
          style={`background-color: ${brightnessToGrayscale(grayValue)};
                  width:${cellSize}rem; 
                  height:${cellSize}rem`}
        ></div>
      {/each}
    </div>
  {/each}
  <Kernel width={kernelDimension * cellSize} height={kernelDimension * cellSize}  {transformStyle} />
</div>
