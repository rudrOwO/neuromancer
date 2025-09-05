<script lang="ts">
  import DesktopOutputPanel from "./Desktop.svelte"
  import MobileOutputPanel from "./Mobile.svelte"

  type Props = {
    isDesktop: boolean
    predictions: number[]
    showHint: boolean
  }

  const { isDesktop, predictions, showHint }: Props = $props()
</script>

{#if isDesktop}
  <DesktopOutputPanel {showHint} {predictions} />
{:else}
  <MobileOutputPanel {showHint} {predictions} />
{/if}
