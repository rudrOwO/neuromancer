<script lang="ts">
  import Processing from "./Processing.svelte"

  type Props = {
    message: string
  }

  const { message }: Props = $props()
</script>

<div
  class="w-[50vw] sm:w-[15vw] fixed grid place-content-center inset-0 m-auto"
>
  <Processing isAnimating={true} />
  <p class="mt-4 text-text-color text-2xl sm:text-4xl min-w-max">
    {message}
  </p>
</div>
