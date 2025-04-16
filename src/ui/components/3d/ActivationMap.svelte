<script lang="ts">
  import type { OutputNode } from "bridge"
  import Tensor2D from "@3d/Tensor2D.svelte"
  import { Align } from "@threlte/extras"

  type Props = OutputNode & {
    z: number
    rowLength: number
    gap: number
    pointSize: number
  }

  const {
    name,
    pointSize,
    rowLength,
    gap,
    dimension,
    activationMaps,
    z,
  }: Props = $props()
</script>

<Align x={0} y={0} z={false}>
  {#each activationMaps as map, i}
    <Tensor2D
      position={[gap * (i % rowLength), gap * Math.floor(i / rowLength), z]}
      {pointSize}
      rows={dimension[2]}
      columns={dimension[3]}
      tensorData={map}
    />
  {/each}
</Align>
