<script lang="ts">
  import type { InferenceResponse } from "bridge"
  import MobileOutputPanel from "@components/output/Mobile.svelte"
  import DesktopOutputPanel from "@components/output/Desktop.svelte"

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
