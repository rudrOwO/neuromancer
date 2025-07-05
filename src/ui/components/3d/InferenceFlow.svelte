<script lang="ts">
  import { getCurrentFlow } from "@sharedstate/inferenceflow.svelte"
  import { T } from "@threlte/core"
  import { MeshLineGeometry, MeshLineMaterial } from "@threlte/extras"
</script>

<!-- TODO  Add Dash animation -->
{#each getCurrentFlow() as edge}
  <T.Mesh>
    <MeshLineGeometry points={edge} />
    <MeshLineMaterial width={1.0} color="gray" />
  </T.Mesh>
{/each}
