<script lang="ts">
  type Props = {
    message: string
    iconSrc: string
  }

  const { message, iconSrc }: Props = $props()
</script>

<div
  class="hintbox mb-2 relative bottom-1.5 w-full max-h-min max-w-fit text-center flex justify-center items-center text-text-color text-xl p-2 bg-background rounded-lg animate-bounce z-100"
>
  <img class="h-8 mx-2" src={iconSrc} alt="Hint Icon" />
  {message}
</div>

<style>
  /* Arrow pointing down */
  .hintbox::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 20px;
    border-width: 10px 10px 0 10px;
    border-style: solid;
    border-color: #212529 transparent transparent transparent;
  }
</style>
