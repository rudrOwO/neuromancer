<script lang="ts">
  import Cell from "./Cell.svelte"
  import Kernel from "./Kernel.svelte"

  type Props = {
    tensorData: Float32Array
    rows: number
    columns: number
    cellSize: number
    kernelDimension: number
    transformStyle: string
    arrowSource: HTMLDivElement
  }

  let {
    tensorData,
    rows,
    columns,
    cellSize,
    kernelDimension,
    transformStyle,
    arrowSource = $bindable(),
  }: Props = $props()

  const rowBuffers = $derived.by(() => {
    const rowBuffers: Float32Array[] = new Array(rows)
    for (let i = 0; i < rows; i++) {
      rowBuffers[i] = tensorData.subarray(i * columns, (i + 1) * columns)
    }
    return rowBuffers
  })
</script>

<div bind:this={arrowSource} class="relative">
  {#each rowBuffers as rowBuffer}
    <div class="flex flex-row">
      {#each rowBuffer as grayValue}
        <Cell {grayValue} {cellSize} masked={false} />
      {/each}
    </div>
  {/each}
  <Kernel
    width={kernelDimension * cellSize}
    height={kernelDimension * cellSize}
    {transformStyle}
  />
</div>
