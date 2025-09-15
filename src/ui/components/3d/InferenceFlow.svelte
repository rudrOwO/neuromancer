<script lang="ts">
  import {
    _3D_STROKE_DASH_ARRAY,
    _3D_STROKE_DASH_RATIO,
    _3D_STROKE_WIDTH,
  } from "@constants/graphics"
  import { getCurrentFlow } from "@sharedstate/flow.svelte"
  import { T, useTask } from "@threlte/core"
  import { MeshLineGeometry, MeshLineMaterial } from "@threlte/extras"

  let dashOffset = $state(0)

  useTask((delta) => {
    //  increase the dash offset every frame
    dashOffset -= delta * 2
  })

  const dashColor = getComputedStyle(document.documentElement).getPropertyValue(
    "--color-accent-light",
  )
</script>

{#each getCurrentFlow() as edge}
  <T.Mesh>
    <MeshLineGeometry points={edge} />
    <MeshLineMaterial
      transparent={true}
      width={_3D_STROKE_WIDTH}
      color={dashColor}
      {dashOffset}
      dashArray={_3D_STROKE_DASH_ARRAY}
      dashRatio={_3D_STROKE_DASH_RATIO}
    />
  </T.Mesh>
{/each}
