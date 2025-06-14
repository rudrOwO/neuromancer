<script lang="ts">
  import {
    infographicsModal,
    closeModal,
    tensorState,
  } from "@sharedstate/infographics.svelte"
  import UnmaskedTensor from "./UnmaskedTensor.svelte"

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
  class="m-auto bg-background outline-0"
  bind:this={infographicsModal.element}
  onclick={closeModal}
>
  <div class="grid place-items-center" onclick={preventClickEventPropagation}>
    <span class="text-white text-xl font-bold my-4"
      >{infographicsModal.layerName}</span
    >

    {#if infographicsModal.isOpen}
      <div class="flex flex-col lg:flex-row">
        <div
          class="grid grid-flow-col [grid-template-rows:repeat(4,min-content)] gap-4"
        >
          {#each tensorState.unmaskedTensors as tensor}
            <UnmaskedTensor
              tensorData={tensor.tensorData}
              rows={tensor.rows}
              columns={tensor.columns}
              grayBoxSize={tensor.grayBoxSize}
              kernelStride={tensor.kernelStride}
              kernelDimension={tensor.kernelDimension}
            ></UnmaskedTensor>
          {/each}
        </div>

        <span class="text-white my-2">Masked tensor</span>
      </div>
    {/if}
  </div>
</dialog>
