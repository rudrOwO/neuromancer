<script lang="ts">
  import LinkIcon from "./LinkIcon.svelte"
  import { isDesktop } from "@sharedstate/mediaquery.svelte"
</script>

{#if isDesktop()}
  <header
    class="flex fixed top-0 w-[100vw] flex-row justify-between content-center z-10 py-2"
  >
    <LinkIcon
      href="https://en.wikipedia.org/wiki/Convolutional_neural_network"
      iconSrc="/brain-icon.svg"
    />

    <div class="flex flex-col text-text-color text-center">
      <span class="font-title text-lg sm:text-xl"> Neuromancer </span>
      <span class="text-base"> 3D Neural Network Visualizer </span>
    </div>

    <LinkIcon
      href="https://github.com/rwdr0/neuromancer"
      iconSrc="/github-icon.svg"
    />
  </header>
{/if}
