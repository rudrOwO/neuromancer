<script lang="ts">
  import clsx from "clsx"

  type Props = {
    label: number
    flexValue: string
    glow: boolean
  }

  const color = [
    "bg-accent-0",
    "bg-accent-1",
    "bg-accent-0",
    "bg-accent-1",
    "bg-accent-0",
    "bg-accent-1",
    "bg-accent-0",
    "bg-accent-1",
    "bg-accent-0",
    "bg-accent-1",
  ]

  const { label, flexValue, glow }: Props = $props()
</script>

<div
  class={clsx(
    "py-1 grid place-items-center font-bold text-xl text-text-color ",
    color[label],
    glow && "animate-pulse",
  )}
  style={`flex: ${flexValue};`}
>
  <span>
    {label}
  </span>
</div>

<style>
  div {
    transition: flex 0.3s ease-in-out;
  }
</style>
