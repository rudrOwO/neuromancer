<script lang="ts">
  import {
    infographicsModal,
    closeModal,
  } from "@sharedstate/infographics.svelte"

  function preventClickEventPropagation(e: MouseEvent) {
    e.stopPropagation()
  }
</script>

<dialog
  class="m-auto bg-background border-0"
  bind:this={infographicsModal.element}
>
  <div class="flex flex-col lg:flex-row m-2 text-white">
    InfoGraphics Modal

    <!-- Unmasked tensors -->
    <div class="flex flex-row lg:flex-col"></div>

    <!-- Masked tensors -->
    <div></div>
  </div>
</dialog>
