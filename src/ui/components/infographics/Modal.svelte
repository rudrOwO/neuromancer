<script lang="ts">
  import clearIcon from "/clear-icon.svg?inline"
  import {
    infographicsModal,
    closeModal,
  } from "@sharedstate/infographics.svelte"
  import Infographics from "./Infographics.svelte"
  import Button from "@components/Button.svelte"

  function preventClickEventPropagation(e: MouseEvent) {
    e.stopPropagation()
  }

  function handleEscapeKey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      closeModal()
    }
  }
</script>

<dialog
  class="m-auto w-[90vw] lg:w-fit bg-background outline-0 rounded-lg backdrop:bg-[#00000050] backdrop:backdrop-blur-xs"
  bind:this={infographicsModal.element}
  onclick={closeModal}
  onkeydown={handleEscapeKey}
>
  <div class="grid place-items-center" onclick={preventClickEventPropagation}>
    <span class="text-white text-xl font-bold my-4"
      >{infographicsModal.layerName}</span
    >

    <div
      class="slide-up-active flex flex-col fixed max-h-min right-2 bottom-[2.5vh] sm:right-6 rounded-lg overflow-hidden z-100 lg:hidden"
    >
      <Button
        onclick={closeModal}
        iconSrc={clearIcon}
        altText="Close Button"
        text="Close"
        type="clear"
      />
    </div>

    {#if infographicsModal.isOpen}
      <Infographics />
    {/if}
  </div>
</dialog>
