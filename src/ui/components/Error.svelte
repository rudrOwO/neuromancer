<script lang="ts">
  import errorIcon from "/error-icon.svg?inline"

  type Props = {
    message: string
  }

  const { message }: Props = $props()
</script>

<div
  class="w-[50vw] sm:w-[15vw] fixed grid place-content-center inset-0 m-auto"
>
  <img class="w-full" src={errorIcon} alt="Error something went wrong" />
  <p class="mt-4 text-text-color text-2xl sm:text-4xl min-w-max">
    {message}
  </p>
</div>
