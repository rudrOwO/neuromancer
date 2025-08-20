<script lang="ts">
  import brainIconRawString from "/brain-icon.svg?raw"

  type Props = {
    message: string
  }

  const { message }: Props = $props()

  $effect(() => {
    const paths = document.querySelectorAll("path")
    paths.forEach((path) => {
      path.style.setProperty(
        "--stroke-length",
        path.getTotalLength().toString(),
      )
    })
  })
</script>

<div
  class="w-[50vw] sm:w-[15vw] fixed grid place-content-center inset-0 m-auto"
>
  {@html brainIconRawString}
  <p class="mt-4 text-text-color text-2xl sm:text-4xl min-w-max">
    {message}
  </p>
</div>
