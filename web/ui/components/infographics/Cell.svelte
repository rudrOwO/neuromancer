<script lang="ts">
  import { brightnessToGrayscale } from "@utils/drawing"

  type Props = {
    grayValue: number
    cellSize: number
    masked: boolean
  }

  const { grayValue, cellSize, masked }: Props = $props()
</script>

<div
  style={`background-color: ${masked ? "black" : brightnessToGrayscale(grayValue)};
          width:${cellSize}rem; 
          height:${cellSize}rem`}
></div>
