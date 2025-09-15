<script lang="ts">
  import { getInferenceResponse } from "@sharedstate/inference.svelte"
  import DesktopOutputPanel from "./Desktop.svelte"
  import MobileOutputPanel from "./Mobile.svelte"

  type Props = {
    isDesktop: boolean
    showHint: boolean
  }

  const { isDesktop, showHint }: Props = $props()
</script>

{#if isDesktop}
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
