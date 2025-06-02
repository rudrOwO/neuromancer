<script lang="ts">
  import Kernel from "./Kernel.svelte"
  import Cell from "./Cell.svelte"

  type Props = {
    tensorData: Float32Array
    rows: number
    columns: number
    cellSize: number
    kernelDimension: number
    transformStyle: string
    maskMatrix: boolean[][]
  }

  const {
    tensorData,
    rows,
    columns,
    cellSize,
    kernelDimension,
    transformStyle,
    maskMatrix,
  }: Props = $props()

  const rowBuffers = $derived.by(() => {
    const rowBuffers: Float32Array[] = new Array(rows)
    for (let i = 0; i < rows; i++) {
      rowBuffers[i] = tensorData.subarray(i * columns, (i + 1) * columns)
    }
    return rowBuffers
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
