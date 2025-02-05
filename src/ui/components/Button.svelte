<script lang="ts">
  type Props = {
    onclick: () => void
    iconSrc: string
    altText: string
    text: string
    type?: "clear" | "default"
  }

  const color = {
    ["clear"]: "bg-clear",
    ["default"]: "bg-accent-0",
  }

  const { onclick, iconSrc, altText, text, type = "default" }: Props = $props()
</script>

<button
  class={"w-[300px] active:scale-105 cursor-pointer flex justify-center items-center p-3 min-w-max max-h-fit overflow-hidden shadow text-text-color " +
    color[type]}
  {onclick}
>
  <img class="h-8 mx-1" src={iconSrc} alt={altText} />
  <span class="text-2xl text-center mx-1">{text}</span>
</button>
