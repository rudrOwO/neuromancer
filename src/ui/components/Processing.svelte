<script lang="ts">
  import brainIconRawString from "/brain-icon.svg?raw"

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

{@html brainIconRawString}
