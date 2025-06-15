<script lang="ts">
  type Props = {
    grayValue: number
    cellSize: number
    masked: boolean
  }

  const { grayValue, cellSize, masked }: Props = $props()

  function brightnessToGrayscale(brightness: number) {
    const gray = Math.round(brightness * 255)
    return `rgb(${gray}, ${gray}, ${gray})`
  }
</script>

{#if masked}
  <div
    style={`background-color: black;
          width:${cellSize}rem; 
          height:${cellSize}rem`}
  ></div>
{:else}
  <div
    style={`background-color: ${brightnessToGrayscale(grayValue)};
          width:${cellSize}rem; 
          height:${cellSize}rem`}
  ></div>
{/if}
