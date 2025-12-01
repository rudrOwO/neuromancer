<script lang="ts">
  import { isDesktop } from "@sharedstate/mediaquery.svelte"
</script>

{#if isDesktop()}
  <footer
    class="text-text-color text-center text-lg fixed left-0 right-0 bottom-2 mx-auto"
  >
    v{__APP_VERSION__} • © 2026
    <a href="https://rudro.me" target="_blank" class="text-red-400"
      ><u>rudro.me</u></a
    >
  </footer>
{/if}
