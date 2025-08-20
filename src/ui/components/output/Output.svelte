<script lang="ts">
  import DesktopOutputPanel from "./Desktop.svelte"
  import MobileOutputPanel from "./Mobile.svelte"
  import type { InferenceResponse } from "bridge"

  type Props = {
    isDesktop: boolean
    inferenceResponse: InferenceResponse
    showHint: boolean
  }

  const { isDesktop, showHint, inferenceResponse }: Props = $props()
</script>

{#if isDesktop}
  <DesktopOutputPanel {showHint} {inferenceResponse} />
{:else}
  <MobileOutputPanel {showHint} {inferenceResponse} />
{/if}
