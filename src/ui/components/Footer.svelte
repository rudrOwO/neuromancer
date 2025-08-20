<script lang="ts">
  type Props = {
    isDesktop: boolean
  }

  const { isDesktop }: Props = $props()
</script>

{#if isDesktop}
  <footer
    class="text-text-color text-center text-lg fixed left-0 right-0 bottom-2 mx-auto"
  >
    v{__APP_VERSION__} • © 2025
    <a href="https://rudro.me" target="_blank" class="text-red-400"
      ><u>rudro.me</u></a
    >
  </footer>
{/if}
