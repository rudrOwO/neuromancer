<script lang="ts">
  import {
    TENSOR_HIGHLIGHT_MAGNITUDE,
    TENSOR_ZOOM_CONSTANT,
  } from "@constants/graphics"
  import { KERNEL_INFO, type LayerName } from "@constants/mnist"
  import {
    clearCurrentFlow,
    setCurrentFlow,
    tensorLocationMatrix,
  } from "@sharedstate/inferenceflow.svelte"
  import {
    infographicsModal,
    showModal,
    tensorState,
  } from "@sharedstate/infographics.svelte"
  import { T } from "@threlte/core"
  import { useCursor } from "@threlte/extras"
  import { getTensorDependencies } from "@utils/tensordeps"
  import type { OutputNode } from "bridge"
  import { AdditiveBlending, Vector3, type Mesh } from "three"

  type Props = {
    layerName: LayerName
    position: [number, number, number]
    pointSize: number
    rows: number
    columns: number
    tensorData: Float32Array
    tensorIndex: number
    previousOutputNode: OutputNode | null
  }

  let {
    layerName,
    pointSize,
    position,
    rows,
    columns,
    tensorData,
    tensorIndex,
    previousOutputNode,
  }: Props = $props()

  let meshRef = $state<Mesh>()
  let hightlighted = $state(false)
  const bufferGeometryLength = 3 * rows * columns
  const vertices = new Float32Array(bufferGeometryLength)

  const worldPosition = new Vector3()

  // Enumerating vertices
  // 3 consecutive values define one vertex (x, y, z)
  for (
    let i = 0, vertexIndex = 0;
    i < bufferGeometryLength;
    i += 3, vertexIndex += 1
  ) {
    /* x axis */ vertices[i] =
      (vertexIndex % columns) * TENSOR_ZOOM_CONSTANT * pointSize
    /* y axis */ vertices[i + 1] =
      -Math.floor(vertexIndex / columns) * TENSOR_ZOOM_CONSTANT * pointSize
    /* z axis */ vertices[i + 2] = 0
  }

  type TensorColor = {
    normal: Float32Array<ArrayBuffer>
    highlighted: Float32Array<ArrayBuffer>
  }

  let tensorcolor: TensorColor = $derived.by(() => {
    let tensorColorArray = new Float32Array(3 * tensorData.length)
    let hightlightedTensorColorArray = new Float32Array(3 * tensorData.length)

    for (let i = 0, j = 0; i < tensorData.length; i += 1, j += 3) {
      const brightness = tensorData[i]

      tensorColorArray[j] = brightness
      tensorColorArray[j + 1] = brightness
      tensorColorArray[j + 2] = brightness

      hightlightedTensorColorArray[j] = Math.min(
        1,
        brightness + TENSOR_HIGHLIGHT_MAGNITUDE,
      )
      hightlightedTensorColorArray[j + 1] = Math.min(
        1,
        brightness + TENSOR_HIGHLIGHT_MAGNITUDE,
      )
      hightlightedTensorColorArray[j + 2] = Math.min(
        1,
        brightness + TENSOR_HIGHLIGHT_MAGNITUDE,
      )
    }

    return {
      normal: tensorColorArray,
      highlighted: hightlightedTensorColorArray,
    }
  })

  const { onPointerEnter, onPointerLeave } = useCursor()

  function handleClick() {
    if (layerName != "Input") {
      const { dependencyTensors } = getTensorDependencies(
        layerName,
        tensorIndex,
        previousOutputNode!.activationMaps, // This will nver be null because user can't click on Input tensor
      )

      const pointSizeToGrayBoxScale = 1 / 22

      tensorState.unmaskedTensors = dependencyTensors.map((dep) => ({
        tensorData: dep,
        rows: previousOutputNode!.dimension[2],
        columns: previousOutputNode!.dimension[3],
        cellSize: pointSize * pointSizeToGrayBoxScale,
        kernelStride: KERNEL_INFO[layerName]!.stride,
        kernelDimension: KERNEL_INFO[layerName]!.dimension,
        kernelTick: KERNEL_INFO[layerName]!.tick,
      }))

      tensorState.maskedTensor = {
        tensorData,
        rows,
        columns,
        cellSize: pointSize * pointSizeToGrayBoxScale,
      }

      infographicsModal.layerName = layerName
      showModal()
    }
  }

  function handlePointerOver() {
    if (layerName != "Input") {
      const { dependencyTensorLocations } = getTensorDependencies(
        layerName,
        tensorIndex,
        previousOutputNode!.activationMaps, // This will nver be null because user can't click on Input tensor
      )

      setCurrentFlow(
        dependencyTensorLocations.map((start) => [start, worldPosition]),
      )

      onPointerEnter()
      hightlighted = true
    }
  }

  function handlePointerOut() {
    if (layerName != "Input") {
      clearCurrentFlow()
      onPointerLeave()
      hightlighted = false
    }
  }

  $effect(() => {
    if (meshRef) {
      // Wait for next frame to ensure matrix is updated
      requestAnimationFrame(() => {
        meshRef!.updateMatrixWorld()
        meshRef!.getWorldPosition(worldPosition)
        tensorLocationMatrix[layerName].push(worldPosition)
      })
    }
  })
</script>

<T.Group {position}>
  <T.Points>
    <T.BufferGeometry>
      <T.BufferAttribute
        args={[vertices, 3]}
        attach={({ parent, ref }) => {
          //@ts-ignore
          parent.setAttribute("position", ref)
          return () => {
            // cleanup function called when ref changes or the component unmounts
          }
        }}
      />
      {#if hightlighted}
        <T.BufferAttribute
          args={[tensorcolor.highlighted, 3]}
          attach={({ parent, ref }) => {
            //@ts-ignore
            parent.setAttribute("color", ref)
            return () => {
              // cleanup function called when ref changes or the component unmounts
            }
          }}
        />
      {:else}
        <T.BufferAttribute
          args={[tensorcolor.normal, 3]}
          attach={({ parent, ref }) => {
            //@ts-ignore
            parent.setAttribute("color", ref)
            return () => {
              // cleanup function called when ref changes or the component unmounts
            }
          }}
        />
      {/if}
    </T.BufferGeometry>

    <T.PointsMaterial
      size={pointSize}
      vertexColors={true}
      blending={AdditiveBlending}
    />
  </T.Points>

  <!-- usually z = -1 would suffice ro render a back mesh. -->
  <!-- But for some reason, it does not render correctly on small screens. -->
  <T.Mesh
    bind:ref={meshRef}
    position={[rows, -columns, -3]}
    onclick={handleClick}
    onpointerover={handlePointerOver}
    onpointerout={handlePointerOut}
  >
    <T.PlaneGeometry
      args={[
        columns * TENSOR_ZOOM_CONSTANT * pointSize,
        rows * TENSOR_ZOOM_CONSTANT * pointSize,
      ]}
    />
    <T.MeshBasicMaterial
      args={[
        {
          color: 0x000000,
          side: 2,
          transparent: true,
          opacity: 0.9,
        },
      ]}
    />
  </T.Mesh>
</T.Group>
