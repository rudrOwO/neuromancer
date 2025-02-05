<script lang="ts">
  type Props = {
    label: number
    flexValue: string
  }

  const color = [
    "bg-accent-0",
    "bg-accent-1",
    "bg-accent-2",
    "bg-accent-0",
    "bg-accent-1",
    "bg-accent-2",
    "bg-accent-0",
    "bg-accent-1",
    "bg-accent-2",
    "bg-accent-0",
  ]

  const { label, flexValue }: Props = $props()
</script>

<div
  class={"py-1 grid place-items-center font-bold text-xl text-text-color " +
    color[label]}
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
