<script lang="ts">
  import {
    infographicsModal,
    closeModal, // TODO  Add this event handler
    tensorState,
  } from "@sharedstate/infographics.svelte"
  import UnmaskedTensor from "./UnmaskedTensor.svelte"

  // TODO  Add this event handler
  function preventClickEventPropagation(e: MouseEvent) {
    e.stopPropagation()
  }
</script>

<dialog
  class="m-auto bg-background outline-0"
  bind:this={infographicsModal.element}
>
  <div class="grid place-items-center">
    <span class="text-white my-2">InfoGraphics Modal</span>

    <div class="flex flex-row">
      <!-- Unmasked tensors -->
      <div
        class="grid grid-flow-col [grid-template-rows:repeat(4,min-content)] gap-4"
      >
        {#each tensorState.unmaskedTensors as tensor}
          <UnmaskedTensor
            tensorData={tensor.tensorData}
            rows={tensor.rows}
            columns={tensor.columns}
            size={tensor.size}
          ></UnmaskedTensor>
        {/each}
      </div>

      <span class="text-white my-2">Masked tensor</span>
    </div>
  </div>
</dialog>
