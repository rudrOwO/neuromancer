<script lang="ts">
  import { useTask } from "@threlte/core"
  import { getCurrentFlow } from "@sharedstate/inferenceflow.svelte"
  import { T } from "@threlte/core"
  import { MeshLineGeometry, MeshLineMaterial } from "@threlte/extras"

  let dashOffset = $state(0)

  useTask((delta) => {
    // every frame we:
    // increase the dash offset
    dashOffset -= delta * 2
  })
</script>

{#each getCurrentFlow() as edge}
  <T.Mesh>
    <MeshLineGeometry points={edge} />
    <MeshLineMaterial
      transparent={true}
      width={2.0}
      color="gray"
      {dashOffset}
      dashArray={0.5}
      dashRatio={0.3}
    />
  </T.Mesh>
{/each}
