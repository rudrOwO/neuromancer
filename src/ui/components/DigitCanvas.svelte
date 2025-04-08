<script lang="ts">
  import { centerCrop, getCoordinates, getMidpoint } from "@utils/math"
  import type { InferenceResponse } from "bridge"
  import { runModel } from "bridge"
  import {
    FINAL_NODE,
    INPUT_TENSOR_DIMENSION,
    ORDERED_NODE_NAMES,
    INPUT_TENSOR_DEFAULT_VALUE,
    ACTIVATION_MAPS_DEFAULT_VALUE,
  } from "@constants/mnist"
  import { DEFAULT_GRAY_VALUE } from "@constants/global"
  import Button from "@components/Button.svelte"

  type Props = {
    inferenceResponse: InferenceResponse
    inputTensorData: Float32Array
  }

  let {
    inferenceResponse = $bindable(),
    inputTensorData = $bindable(),
  }: Props = $props()

  let isUIVisible = true

  let canvas: HTMLCanvasElement
  let canvasScaled: HTMLCanvasElement
  let canvasCenterCrop: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D
  let ctxCenterCrop: CanvasRenderingContext2D
  let ctxScaled: CanvasRenderingContext2D

  let strokes: any = []
  let isDrawing = false
  let isThrottled = false
  let canvasHeight = $state("min-content")

  const preProcess = (): {
    inputTensorData: Float32Array
    renderTensorData: Float32Array
  } => {
    // center crop
    const imageDataCenterCrop = centerCrop(
      ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
    )
    ctxCenterCrop.canvas.width = imageDataCenterCrop.width
    ctxCenterCrop.canvas.height = imageDataCenterCrop.height
    ctxCenterCrop.putImageData(imageDataCenterCrop, 0, 0)
    // scaled to 28 x 28
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
    const tensorLength = 28 * 28
    const inputTensorData = new Float32Array(tensorLength)

    for (let i = 0, j = 0, len = data.length; i < len; i += 4, j += 3) {
      inputTensorData[i / 4] = data[i + 3] / 255
    }

    const renderTensorData = new Float32Array(3 * tensorLength) // 3 * for RGB
    renderTensorData.fill(DEFAULT_GRAY_VALUE)

    for (let i = 0, j = 0; i < tensorLength; i += 1, j += 3) {
      const brightness = Math.min(1.0, renderTensorData[j] + inputTensorData[i])
      renderTensorData[j] = brightness
      renderTensorData[j + 1] = brightness
      renderTensorData[j + 2] = brightness
    }

    return { inputTensorData, renderTensorData }
  }

  const clear = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctxCenterCrop.clearRect(
      0,
      0,
      ctxCenterCrop.canvas.width,
      ctxCenterCrop.canvas.height,
    )
    ctxScaled.clearRect(0, 0, ctxScaled.canvas.width, ctxScaled.canvas.height)
    inputTensorData = INPUT_TENSOR_DEFAULT_VALUE
    inferenceResponse = ACTIVATION_MAPS_DEFAULT_VALUE
    strokes = []
  }

  const toggleUI = () => {
    if (isUIVisible) {
      canvasHeight = "0px"
    } else {
      canvasHeight = "min-content"
    }

    isUIVisible = !isUIVisible
  }

  const startDraw = (e: any) => {
    isDrawing = true
    strokes.push([])
    const points = strokes[strokes.length - 1]
    points.push(getCoordinates(e))
    draw(e)
  }

  const stopDraw = () => {
    isDrawing = false
  }

  const draw = (e: any) => {
    // disable scrolling behavior when drawing
    e.preventDefault()
    ctx.lineWidth = 20
    ctx.lineJoin = ctx.lineCap = "round"
    ctx.strokeStyle = window.getComputedStyle(canvas).color
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

  const handleMouseMove = (e: any) => {
    if (!isDrawing || isThrottled) {
      return
    }
    requestAnimationFrame(async function () {
      draw(e)
      const preProcessResult = preProcess()

      inferenceResponse = await runModel(
        preProcessResult.inputTensorData,
        INPUT_TENSOR_DIMENSION,
        ORDERED_NODE_NAMES,
        FINAL_NODE,
      )
      inputTensorData = preProcessResult.renderTensorData

      isThrottled = false
    })
    isThrottled = true
  }

  $effect(() => {
    ctx = canvas.getContext("2d", { willReadFrequently: true })!
    ctxCenterCrop = canvasCenterCrop.getContext("2d")!
    ctxScaled = canvasScaled.getContext("2d", { willReadFrequently: true })!
  })
</script>

<div
  class="flex flex-col fixed w-[300px] max-h-min right-2 bottom-[2.5vh] sm:right-6 rounded-lg overflow-hidden z-100"
  style:height={canvasHeight}
>
  <div
    class="w-full text-center flex justify-center items-center text-text-color text-2xl p-3 bg-accent-0 shadow-xl"
  >
    <img class="h-8 mx-2" src="/pen-icon.svg" alt="Pen Icon" />
    Draw a Digit (0-9)
  </div>
  <canvas
    bind:this={canvas}
    class="cursor-crosshair bg-background text-text-color border-gray-400 hover:border-2"
    id="input-canvas"
    width="300"
    height="300"
    onmousedown={startDraw}
    onmouseup={stopDraw}
    onmouseleave={stopDraw}
    onmousemove={handleMouseMove}
    ontouchstart={startDraw}
    ontouchend={stopDraw}
    ontouchmove={handleMouseMove}
  ></canvas>
  <canvas
    bind:this={canvasScaled}
    id="input-canvas-scaled"
    width="28"
    height="28"
    style="display: none"
  ></canvas>
  <canvas
    bind:this={canvasCenterCrop}
    id="input-canvas-centercrop"
    style="display: none"
  ></canvas>
  <div class="flex">
    <Button
      onclick={toggleUI}
      iconSrc="/hide-icon.svg"
      altText="Hide"
      text="Hide"
    />
    <Button
      onclick={clear}
      iconSrc="/clear-icon.svg"
      altText="Clear Button"
      text="Clear"
      type="clear"
    />
  </div>
</div>

<div
  class="flex flex-col fixed w-[300px] max-h-min right-2 bottom-[2.5vh] sm:right-6 rounded-lg overflow-hidden z-10"
>
  <Button
    onclick={toggleUI}
    iconSrc="/canvas-icon.svg"
    altText="Show Canvas"
    text="Show Canvas"
  />
</div>
