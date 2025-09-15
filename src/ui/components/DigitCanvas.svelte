<script lang="ts">
  /*
   * Portions of this code are derived from ONNX Runtime Web Demo which is licensed under the MIT License.
   *
   * Copyright (c) Microsoft Corporation.
   *
   * This file has been modified by Dardaul (Rudro) Hoque and is also licensed under the MIT License.
   *
   * Modified sources:
   * https://github.com/microsoft/onnxruntime-web-demo/blob/35239ea55876779fae9829654ce60fb352b252d7/src/components/common/DrawingModelUI.vue
   * https://github.com/microsoft/onnxruntime-web-demo/blob/35239ea55876779fae9829654ce60fb352b252d7/src/components/models/MNIST.vue
   *
   * The original full license text is available in the root directory of this project.
   */

  import {
    CANVAS_LINE_CAP,
    CANVAS_LINE_JOIN,
    CANVAS_LINE_WIDTH,
    CANVAS_TICK,
    TENSOR_DEFAULT_GRAY_VALUE,
  } from "@constants/graphics"
  import {
    ACTIVATION_MAPS_DEFAULT_VALUE,
    FINAL_NODE,
    INPUT_TENSOR_DEFAULT_VALUE,
    INPUT_TENSOR_DIMENSION,
    ORDERED_NODE_NAMES,
  } from "@constants/mnist"
  import { setInferenceResponse } from "@sharedstate/inference.svelte"
  import { centerCrop, getCoordinates, getMidpoint } from "@utils/drawing"
  import { runModel } from "bridge"
  import Button from "./Button.svelte"
  import Hint from "./Hint.svelte"
  import canvasIcon from "/canvas-icon.svg?inline"
  import clearIcon from "/clear-icon.svg?inline"
  import hideIcon from "/hide-icon.svg?inline"
  import penIcon from "/pen-icon.svg?inline"

  type Props = {
    inputTensorData: Float32Array
    showHint: boolean
    isDesktop: boolean
  }

  let {
    inputTensorData = $bindable(),
    showHint = $bindable(),
    isDesktop,
  }: Props = $props()

  let showCanvas: HTMLDivElement
  let containerDiv: HTMLDivElement
  let canvas: HTMLCanvasElement
  let canvasScaled: HTMLCanvasElement
  let canvasCenterCrop: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D
  let ctxCenterCrop: CanvasRenderingContext2D
  let ctxScaled: CanvasRenderingContext2D
  let isDrawing = false
  let isUIVisible = true
  let strokes: any = []
  let lastTime = performance.now()

  function preProcess(): {
    inputTensorData: Float32Array
    renderTensorData: Float32Array
  } {
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

    for (let i = 0, len = data.length; i < len; i += 4) {
      inputTensorData[i / 4] = data[i + 3] / 255
    }

    const renderTensorData = new Float32Array(tensorLength)
    renderTensorData.fill(TENSOR_DEFAULT_GRAY_VALUE)

    for (let i = 0; i < tensorLength; i += 1) {
      const brightness = Math.min(1.0, renderTensorData[i] + inputTensorData[i])
      renderTensorData[i] = brightness
    }

    return { inputTensorData, renderTensorData }
  }

  function clear() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctxCenterCrop.clearRect(
      0,
      0,
      ctxCenterCrop.canvas.width,
      ctxCenterCrop.canvas.height,
    )
    ctxScaled.clearRect(0, 0, ctxScaled.canvas.width, ctxScaled.canvas.height)
    inputTensorData = INPUT_TENSOR_DEFAULT_VALUE
    setInferenceResponse(ACTIVATION_MAPS_DEFAULT_VALUE)
    strokes = []
  }

  function toggleUI() {
    if (isUIVisible) {
      containerDiv.classList.remove("slide-up-active")
      containerDiv.classList.add("slide-down-active")

      showCanvas.classList.remove("slide-down-active")
      showCanvas.classList.add("slide-up-active")
    } else {
      containerDiv.classList.remove("slide-down-active")
      containerDiv.classList.add("slide-up-active")

      showCanvas.classList.remove("slide-up-active")
      showCanvas.classList.add("slide-down-active")
    }

    isUIVisible = !isUIVisible
  }

  function startDraw(e: any) {
    isDrawing = true
    strokes.push([])
    const points = strokes[strokes.length - 1]
    points.push(getCoordinates(e))
    draw(e)
  }

  function stopDraw() {
    isDrawing = false
  }

  function draw(e: any) {
    ctx.lineWidth = CANVAS_LINE_WIDTH
    ctx.lineJoin = CANVAS_LINE_JOIN
    ctx.lineCap = CANVAS_LINE_CAP
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

  function handleMouseMove(e: any) {
    if (!isDrawing) {
      return
    }

    requestAnimationFrame(function (timestamp: DOMHighResTimeStamp) {
      if (timestamp - lastTime < CANVAS_TICK) {
        return
      }

      lastTime = timestamp

      draw(e)
      const preProcessResult = preProcess()

      runModel(
        preProcessResult.inputTensorData,
        INPUT_TENSOR_DIMENSION,
        ORDERED_NODE_NAMES,
        FINAL_NODE,
      ) // inference response is updated asynchronously at bridge

      inputTensorData = preProcessResult.renderTensorData
    })
  }

  function handleMouseDown() {
    showHint = false
  }

  $effect(() => {
    ctx = canvas.getContext("2d", { willReadFrequently: true })!
    ctxCenterCrop = canvasCenterCrop.getContext("2d")!
    ctxScaled = canvasScaled.getContext("2d", { willReadFrequently: true })!
  })
</script>

<div
  class="flex flex-col fixed w-[300px] max-h-min right-2 bottom-[2.5dvh] sm:right-6 z-100"
  bind:this={containerDiv}
  role="none"
  onmousedown={handleMouseDown}
>
  {#if showHint}
    <Hint iconSrc={penIcon} message="Draw a digit (0 - 9)" />
  {:else}
    <img class="h-8 w-full mb-2" src={penIcon} alt="Pen Icon" />
  {/if}
  <canvas
    bind:this={canvas}
    class="cursor-crosshair bg-background text-text-color border-gray-400 hover:border-2 rounded-lg overflow-hidden mb-2"
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
  <div class="flex rounded-lg overflow-hidden">
    <Button
      onclick={clear}
      iconSrc={clearIcon}
      altText="Clear Button"
      text="Clear"
      type="clear"
    />
    {#if !isDesktop}
      <Button
        onclick={toggleUI}
        iconSrc={hideIcon}
        altText="Hide"
        text="Hide"
      />
    {/if}
  </div>
</div>

<div
  class="flex flex-col fixed w-[300px] max-h-min right-2 bottom-[2.5dvh] sm:right-6 rounded-lg overflow-hidden z-10"
  bind:this={showCanvas}
>
  <Button
    onclick={toggleUI}
    iconSrc={canvasIcon}
    altText="Show Canvas"
    text="Show Canvas"
  />
</div>
