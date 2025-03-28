<script lang="ts">
  import { T } from "@threlte/core"

  type Props = {
    position: [number, number, number]
    rows: number
    columns: number
    tensorData: Float32Array
  }

  const { position, rows, columns, tensorData }: Props = $props()
  const pointSize = 3
  const bufferGeometryLength = 3 * rows * columns
  const vertices = new Float32Array(bufferGeometryLength)

  for (
    let i = 0, vertexIndex = 0;
    i < bufferGeometryLength;
    i += 3, vertexIndex += 1
  ) {
    vertices[i] = vertexIndex % columns
    vertices[i + 1] = rows - Math.floor(vertexIndex / columns)
    vertices[i + 2] = 0
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
