<script lang="ts">
  type Props = {
    isDesktop: boolean
  }

  const { isDesktop }: Props = $props()
</script>

{#if isDesktop}
  <div
    class="text-text-color text-center text-lg fixed left-0 right-0 bottom-2 mx-auto"
  >
    © 2025. Made by
    <a href="https://rudro.me" target="_blank" class="text-red-400"
      ><u>rudro.me</u></a
    >
  </div>
{/if}
