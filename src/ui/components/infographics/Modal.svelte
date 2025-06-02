<script lang="ts">
  import {
    infographicsModal,
    closeModal,
  } from "@sharedstate/infographics.svelte"
  import Infographics from "./Infographics.svelte"

  function preventClickEventPropagation(e: MouseEvent) {
    e.stopPropagation()
  }

  function handleEscapeKey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      closeModal()
    }
  }

  $effect(() => {
    infographicsModal.element!.addEventListener("keydown", handleEscapeKey)

    return () => {
      infographicsModal.element!.removeEventListener("keydown", handleEscapeKey)
    }
  })
</script>

<dialog
  class="m-auto bg-background outline-0 rounded-lg"
  bind:this={infographicsModal.element}
  onclick={closeModal}
>
  <div
    class="grid place-items-center p-2"
    onclick={preventClickEventPropagation}
  >
    <span class="text-white text-xl font-bold my-4"
      >{infographicsModal.layerName}</span
    >
    {#if infographicsModal.isOpen}
      <Infographics />
    {/if}
  </div>
</dialog>
