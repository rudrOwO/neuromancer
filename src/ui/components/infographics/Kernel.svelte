<script lang="ts">
  import type { Kernel } from "@sharedstate/infographics.svelte"

  const {
    stride,
    dimension,
    tensorCellSize,
    tensorColumns,
    tensorRows,
    tick,
  }: Kernel = $props()

  let lastTime = performance.now()
  let animationId: number
  let transformStyle = $state("")
  let row = 0
  let col = 0

  function animate(timestamp: DOMHighResTimeStamp) {
    if (timestamp - lastTime >= tick) {
      lastTime = timestamp

      const x = col * tensorCellSize
      const y = row * tensorCellSize
      transformStyle = `transform: translate(${x}rem, ${y}rem);`

      col += stride
      if (col + dimension > tensorRows) {
        col = 0
        row += stride
      }
      if (row + dimension > tensorColumns) {
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

<div
  class="absolute top-0 left-0 z-100 border-2 border-green-600"
  style={`width: ${dimension * tensorCellSize}rem; height: ${dimension * tensorCellSize}rem; ${transformStyle}`}
></div>
