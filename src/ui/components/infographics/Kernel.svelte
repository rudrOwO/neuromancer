<script lang="ts">
  type Props = {
    width: number
    height: number
    transformStyle: string
  }
  const { width, height, transformStyle }: Props = $props()
</script>

<div
  class="absolute top-0 left-0 z-100 border-2 border-green-600"
  style={`width: ${width}rem; height: ${height}rem; ${transformStyle}`}
></div>
