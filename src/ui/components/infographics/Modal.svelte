<script lang="ts">
  import {
    infographicsModal,
    closeModal,
    tensorState,
  } from "@sharedstate/infographics.svelte"
  import Tensor from "./Tensor.svelte"

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
      <div class="flex flex-row gap-10">
        <div class="flex flex-col gap-4">
          {#each tensorState.unmaskedTensors as tensor}
            <Tensor
              tensorData={tensor.tensorData}
              rows={tensor.rows}
              columns={tensor.columns}
              cellSize={tensor.cellSize}
              kernelStride={tensor.kernelStride}
              kernelDimension={tensor.kernelDimension}
              kernelTick={tensor.kernelTick}
            ></Tensor>
          {/each}
        </div>

        <span class="text-white">Masked tensor</span>
      </div>
    {/if}
  </div>
</dialog>
