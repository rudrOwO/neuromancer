<script lang="ts">
  type Props = {
    onclick: () => void
    iconSrc: string
    altText: string
    text: string
    color: "bg-clear" | "bg-hidden" | "bg-accent"
  }

  const { onclick, iconSrc, altText, color, text }: Props = $props()
  let btn: HTMLButtonElement | null = null

  function rippleEffect(event: any) {
    const btn = event.currentTarget

    const circle = document.createElement("span")
    const diameter = Math.max(btn.clientWidth, btn.clientHeight)
    const radius = diameter / 2
    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${event.clientX - (btn.offsetLeft + radius)}px`
    circle.style.top = `${event.clientY - (btn.offsetTop + radius)}px`
    circle.classList.add("ripple")

    const ripple = btn.getElementsByClassName("ripple")[0]

    if (ripple) {
      ripple.remove()
    }

    btn.appendChild(circle)
  }

  $effect(() => {
    btn?.addEventListener("click", rippleEffect)

    return () => {
      btn?.removeEventListener("click", rippleEffect)
    }
  })
</script>

<button
  bind:this={btn}
  class={"w-[300px] cursor-pointer flex justify-center items-center p-3 min-w-max max-h-fit overflow-hidden shadow relative text-text-color " +
    color}
  {onclick}
>
  <img class="h-8 mx-1" src={iconSrc} alt={altText} />
  <span class="text-2xl text-center mx-1">{text}</span>
</button>
