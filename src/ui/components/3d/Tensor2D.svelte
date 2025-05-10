<script lang="ts">
  import { TENSOR_ZOOM_CONSTANT } from "@constants/global"
  import { T } from "@threlte/core"

  type Props = {
    position: [number, number, number]
    pointSize: number
    rows: number
    columns: number
    tensorData: Float32Array
  }

  const { pointSize, position, rows, columns, tensorData }: Props = $props()
  const bufferGeometryLength = 3 * rows * columns
  const vertices = new Float32Array(bufferGeometryLength)

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
</script>

<T.Points {position}>
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
    <T.BufferAttribute
      args={[tensorData, 3]}
      attach={({ parent, ref }) => {
        //@ts-ignore
        parent.setAttribute("color", ref)
        return () => {
          // cleanup function called when ref changes or the component unmounts
        }
      }}
    />
  </T.BufferGeometry>
  <T.PointsMaterial size={pointSize} vertexColors={true} />
</T.Points>
