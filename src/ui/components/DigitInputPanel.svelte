<script lang="ts">
  import { centerCrop, getCoordinates, getMidpoint } from "@utils/math"
  import type { InferenceResponse } from "shared/bridge"
  import { runModel } from "shared/bridge"
  import { INPUT_TENSOR_DIMENSION } from "shared/constants/mnist"

  type Props = {
    inferenceResponse: InferenceResponse | null
  }

  let { inferenceResponse = $bindable() }: Props = $props()

  let canvas: HTMLCanvasElement
  let canvasScaled: HTMLCanvasElement
  let canvasCenterCrop: HTMLCanvasElement

  let strokes: any = []
  let isDrawing = false

  function preProcess(ctx: CanvasRenderingContext2D): Float32Array {
    // center crop
    const imageDataCenterCrop = centerCrop(
      ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
    )
    const ctxCenterCrop = canvasCenterCrop.getContext("2d")!
    ctxCenterCrop.canvas.width = imageDataCenterCrop.width
    ctxCenterCrop.canvas.height = imageDataCenterCrop.height
    ctxCenterCrop.putImageData(imageDataCenterCrop, 0, 0)
    // scaled to 28 x 28
    const ctxScaled = canvasScaled.getContext("2d")!
    ctxScaled.save()
    ctxScaled.scale(
      28 / ctxCenterCrop.canvas.width,
      28 / ctxCenterCrop.canvas.height,
    )
    ctxScaled.clearRect(
      0,
      0,
      ctxCenterCrop.canvas.width,
      ctxCenterCrop.canvas.height,
    )
    ctxScaled.drawImage(canvasCenterCrop, 0, 0)
    const imageDataScaled = ctxScaled.getImageData(
      0,
      0,
      ctxScaled.canvas.width,
      ctxScaled.canvas.height,
    )
    ctxScaled.restore()
    // process image data for model input
    const { data } = imageDataScaled
    const input = new Float32Array(784)
    for (let i = 0, len = data.length; i < len; i += 4) {
      input[i / 4] = data[i + 3] / 255
    }

    return input
  }

  async function run() {
    const ctx = canvas.getContext("2d")!
    const inputTensorData = preProcess(ctx)
    inferenceResponse = await runModel(inputTensorData, INPUT_TENSOR_DIMENSION)
  }

  function clear() {
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const ctxCenterCrop = canvasCenterCrop.getContext("2d")!
    ctxCenterCrop.clearRect(
      0,
      0,
      ctxCenterCrop.canvas.width,
      ctxCenterCrop.canvas.height,
    )
    const ctxScaled = canvasScaled.getContext("2d")!
    ctxScaled.clearRect(0, 0, ctxScaled.canvas.width, ctxScaled.canvas.height)
    inferenceResponse = null
    strokes = []
  }

  function activateDraw(e: any) {
    isDrawing = true
    strokes.push([])
    const points = strokes[strokes.length - 1]
    points.push(getCoordinates(e))
    draw(e)
  }

  function deactivateDraw() {
    isDrawing = false
  }

  function draw(e: any) {
    // disable scrolling behavior when drawing
    e.preventDefault()
    const ctx = canvas.getContext("2d")!
    ctx.lineWidth = 20
    ctx.lineJoin = ctx.lineCap = "round"
    ctx.strokeStyle = "#393E46"
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let points = strokes[strokes.length - 1]
    points.push(getCoordinates(e))
    // draw individual strokes
    for (let s = 0, slen = strokes.length; s < slen; s++) {
      points = strokes[s]
      let p1 = points[0]
      let p2 = points[1]
      ctx.beginPath()
      ctx.moveTo(p1[0], p1[1])
      // draw points in stroke
      // quadratic bezier curve
      for (let i = 1, len = points.length; i < len; i++) {
        const midpoint = getMidpoint(p1, p2)
        ctx.quadraticCurveTo(p1[0], p1[1], midpoint[0], midpoint[1])
        p1 = points[i]
        p2 = points[i + 1]
      }
      ctx.lineTo(p1[0], p1[1])
      ctx.stroke()
    }
  }

  function handleMouseMove(e: any) {
    if (!isDrawing) {
      return
    }
    requestAnimationFrame(async function () {
      draw(e)
      await run()
      isDrawing = true
    })
    deactivateDraw()
  }
</script>

<button class="p-2 rounded-md bg-slate-300 m-2" onclick={clear}>CLear</button>
<canvas
  bind:this={canvas}
  class="bg-slate-500"
  id="input-canvas"
  width="300"
  height="300"
  onmousedown={activateDraw}
  onmouseup={deactivateDraw}
  onmouseleave={deactivateDraw}
  onmousemove={handleMouseMove}
  ontouchstart={activateDraw}
  ontouchend={deactivateDraw}
  ontouchmove={handleMouseMove}
></canvas>
<canvas bind:this={canvasScaled} id="input-canvas-scaled" width="28" height="28"
></canvas>
<canvas
  bind:this={canvasCenterCrop}
  id="input-canvas-centercrop"
  style="display: none"
></canvas>
