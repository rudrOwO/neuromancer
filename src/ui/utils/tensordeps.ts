import type { LayerName } from "@constants/mnist"
import type { Vector3 } from "three"
import { tensorLocationMatrix } from "@sharedstate/inferenceflow.svelte"

export function getTensorDependencies(
  layerName: LayerName,
  tensorIndex: number,
  previousLayerActivationMaps: Array<Float32Array>,
): {
  dependencyTensors: Float32Array[]
  dependencyTensorLocations: Array<Vector3>
} {
  switch (layerName) {
    case "Convolution Layer #1":
      return {
        dependencyTensors: previousLayerActivationMaps,
        dependencyTensorLocations: tensorLocationMatrix["Input"],
      }
    case "Max Pool #1":
      return {
        dependencyTensors: [previousLayerActivationMaps[tensorIndex]],
        dependencyTensorLocations: [
          tensorLocationMatrix["Convolution Layer #1"][tensorIndex],
        ],
      }
    case "Convolution Layer #2":
      return {
        dependencyTensors: previousLayerActivationMaps,
        dependencyTensorLocations: tensorLocationMatrix["Max Pool #1"],
      }
    case "Max Pool #2":
      return {
        dependencyTensors: [previousLayerActivationMaps[tensorIndex]],
        dependencyTensorLocations: [
          tensorLocationMatrix["Convolution Layer #2"][tensorIndex],
        ],
      }
  }

  throw "Unexpected Error: Layer name is wrong"
}
