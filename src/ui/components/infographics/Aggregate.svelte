<script lang="ts">
  type Props = {
    arrowTarget: HTMLImageElement
  }

  let { arrowTarget = $bindable() }: Props = $props()
</script>

<div class="w-full flex justify-center">
  <img
    bind:this={arrowTarget}
    class="h-6 w-6 lg:h-10 lg:w-10"
    src="/plus-icon.svg"
    alt="plus icon"
  />
</div>

<p
  class="absolute top-1/2 translate-y-8 left-1/2 -translate-x-1/2 text-sm text-gray-300 text-center min-w-max hidden lg:block"
>
  Aggregate and add bias
</p>
