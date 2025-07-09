<script lang="ts">
  type Props = {
    isAnimating: boolean
  }

  const { isAnimating }: Props = $props()
  let paths: NodeListOf<SVGPathElement>

  $effect(() => {
    paths = document.querySelectorAll("path")
    paths.forEach((path) => {
      path.style.setProperty(
        "--stroke-length",
        path.getTotalLength().toString(),
      )
    })
  })

  $effect(() => {
    if (isAnimating) {
      paths.forEach((path) => path.classList.add("stroke-animation"))
    } else {
      paths.forEach((path) => path.classList.remove("stroke-animation"))
    }
  })
</script>

<!-- svg is inlined because I need to apply animations to the strokes -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="white"
  stroke-width="1"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- Putting style here to prevent svelte from hashing out classnames LOL -->
  <style>
    .stroke-animation {
      --stroke-length: 0;
      stroke-dasharray: var(--stroke-length);
      stroke-dashoffset: calc(var(--stroke-length) * -1);
      animation: draw 1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite forwards;
    }

    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }
  </style>

  <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
  <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
  <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
  <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
  <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
  <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" /></svg
>
