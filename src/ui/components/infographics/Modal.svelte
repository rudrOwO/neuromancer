<script lang="ts">
  import type { InferenceResponse } from "bridge"

  type Props = {
    layerName: "Input" | "Convolution Layer #1" | "Convolution Layer #2"
    inferenceResponse: InferenceResponse
  }
</script>
