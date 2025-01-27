<script lang="ts">
  type Props = {
    onclick: () => void
  }

  const { onclick }: Props = $props()
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
  class="cursor-pointer flex justify-center items-center rounded-b-lg p-2 min-w-max overflow-hidden shadow relative bg-red-500 text-white hover:bg-opacity-90"
  {onclick}
>
  <img class="h-10 mx-1" src="/clear-icon.svg" alt="Clear Button" />
  <span class="text-2xl text-center mx-1">Clear</span>
</button>
