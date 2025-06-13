import type { LayerName } from "@constants/mnist"

export function getTensorDependencies(
  layerName: LayerName,
  tensorIndex: number,
  previousLayerActivationMaps: Float32Array[],
): Float32Array[] {
  switch (layerName) {
    case "Convolution Layer #1":
      return previousLayerActivationMaps
    case "Max Pool #1":
      return [previousLayerActivationMaps[tensorIndex]]
    case "Convolution Layer #2":
      return previousLayerActivationMaps
    case "Max Pool #2":
      return [previousLayerActivationMaps[tensorIndex]]
  }

  throw "Unexpected Error: Layer name is wrong"
}
