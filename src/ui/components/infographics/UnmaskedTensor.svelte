<script lang="ts">
  type Props = {
    tensorData: Float32Array
    rows: number
    columns: number
    size: number
  }

  const { tensorData, rows, columns, size }: Props = $props()
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

<div>
  {#each rowBuffers as rowBuffer}
    <div class="flex flex-row">
      {#each rowBuffer as brightness}
        <div
          style={`background-color: ${brightnessToGrayscale(brightness)};
                  width:${size}rem; 
                  height:${size}rem`}
        ></div>
      {/each}
    </div>
  {/each}
</div>
