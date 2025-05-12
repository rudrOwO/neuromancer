<script lang="ts">
  import clsx from "clsx"

  type Props = {
    label: number
    flexValue: string
    highlight: boolean
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

  const { label, flexValue, highlight }: Props = $props()
</script>

<div
  class={clsx(
    "py-1 grid place-items-center font-bold text-base sm:text-xl text-text-color",
    color[label],
    highlight && "highlight-box",
  )}
  style:flex={flexValue}
>
  {label}
</div>

<style>
  div {
    transition: flex 0.3s ease-in-out;
  }

  .highlight-box {
    border: 2px solid transparent;
    border-radius: 4px;
    animation: borderPulse 2s infinite ease-in-out;
  }

  /* Keyframes for border animation */
  @keyframes borderPulse {
    0%,
    100% {
      border-color: transparent;
    }
    50% {
      border-color: var(--color-gray-300);
    }
  }
</style>
