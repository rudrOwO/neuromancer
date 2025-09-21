<script lang="ts">
  import { getInferenceResponse } from "@sharedstate/inference.svelte"
  import DesktopOutputPanel from "./Desktop.svelte"
  import MobileOutputPanel from "./Mobile.svelte"
  import { isDesktop } from "@sharedstate/mediaquery.svelte"

  type Props = {
    showHint: boolean
  }

  const { showHint }: Props = $props()
</script>

{#if isDesktop()}
  <DesktopOutputPanel
    {showHint}
    predictions={getInferenceResponse().predictions}
  />
{:else}
  <MobileOutputPanel
    {showHint}
    predictions={getInferenceResponse().predictions}
  />
{/if}
