<script lang="ts">
  import type { Tensor } from "@sharedstate/infographics.svelte"
  import Kernel from "./Kernel.svelte"

  const {
    tensorData,
    rows,
    columns,
    grayBoxSize,
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
</script>

<div class="relative">
  {#each rowBuffers as rowBuffer}
    <div class="flex flex-row">
      {#each rowBuffer as grayValue}
        <div
          style={`background-color: ${brightnessToGrayscale(grayValue)};
                  width:${grayBoxSize}rem; 
                  height:${grayBoxSize}rem`}
        ></div>
      {/each}
    </div>
  {/each}
  <Kernel
    stride={kernelStride}
    dimension={kernelDimension}
    tensorCellSize={grayBoxSize}
    tensorRows={rows}
    tensorColumns={columns}
    tick={kernelTick}
  />
</div>
