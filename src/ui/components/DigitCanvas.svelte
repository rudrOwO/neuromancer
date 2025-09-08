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
   * https://github.com/microsoft/onnxruntime-web-demo/blob/3766c1b22aec76c471bb14333b940f6910de4eb1/src/utils/math.ts
   *
   * The original full license text is available in the root directory of this project.
   */

  import canvasIcon from "/canvas-icon.svg?inline"
  import clearIcon from "/clear-icon.svg?inline"
  import hideIcon from "/hide-icon.svg?inline"
  import penIcon from "/pen-icon.svg?inline"
  import {
    CANVAS_LINE_CAP,
    CANVAS_LINE_JOIN,
    CANVAS_LINE_WIDTH,
    TENSOR_DEFAULT_GRAY_VALUE,
  } from "@constants/graphics"
  import {
    ACTIVATION_MAPS_DEFAULT_VALUE,
    FINAL_NODE,
    INPUT_TENSOR_DEFAULT_VALUE,
    INPUT_TENSOR_DIMENSION,
    ORDERED_NODE_NAMES,
  } from "@constants/mnist"
  import { runModel, type InferenceResponse } from "bridge"
  import Button from "./Button.svelte"
  import Hint from "./Hint.svelte"

  type Props = {
    inferenceResponse: InferenceResponse
    inputTensorData: Float32Array
    showHint: boolean
    isDesktop: boolean
  }

  let {
    inferenceResponse = $bindable(),
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
  let isThrottled = false

  export function getMidpoint(p1: number[], p2: number[]): number[] {
    const [x1, y1] = p1
    const [x2, y2] = p2
    return [x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2]
  }

  /**
  Gets the (x, y) coordinates of an UI event relative to its target,
  e.g., canvas. Accounts for touch events as well as mouse events.
 */
  export function getCoordinates(e: any) {
    let { clientX, clientY } = e
    // for touch event
    if (e.touches && e.touches.length) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    }
    const { left, top } = e.target.getBoundingClientRect()
    const [x, y] = [clientX - left, clientY - top]
    return [x, y]
  }

  // Centers and crops canvas ImageData based on alpha channel.
  export function centerCrop(imageData: ImageData): ImageData {
    const { data, width, height } = imageData
    let [xmin, ymin] = [width, height]
    let [xmax, ymax] = [-1, -1]
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const idx = i + j * width
        if (data[4 * idx + 3] > 0) {
          if (i < xmin) {
            xmin = i
          }
          if (i > xmax) {
            xmax = i
          }
          if (j < ymin) {
            ymin = j
          }
          if (j > ymax) {
            ymax = j
          }
        }
      }
    }

    // add a little padding
    xmin -= 20
    xmax += 20
    ymin -= 20
    ymax += 20

    // make bounding box square
    let [widthNew, heightNew] = [xmax - xmin + 1, ymax - ymin + 1]
    if (widthNew < heightNew) {
      // new width < new height
      const halfBefore = Math.floor((heightNew - widthNew) / 2)
      const halfAfter = heightNew - widthNew - halfBefore
      xmax += halfAfter
      xmin -= halfBefore
    } else if (widthNew > heightNew) {
      // new width > new height
      const halfBefore = Math.floor((widthNew - heightNew) / 2)
      const halfAfter = widthNew - heightNew - halfBefore
      ymax += halfAfter
      ymin -= halfBefore
    }

    widthNew = xmax - xmin + 1
    heightNew = ymax - ymin + 1
    const dataNew = new Uint8ClampedArray(widthNew * heightNew * 4)
    for (let i = xmin; i <= xmax; i++) {
      for (let j = ymin; j <= ymax; j++) {
        if (i >= 0 && i < width && j >= 0 && j < height) {
          const idx = i + j * width
          const idxNew = i - xmin + (j - ymin) * widthNew
          dataNew[4 * idxNew + 3] = data[4 * idx + 3]
        }
      }
    }

    return new ImageData(dataNew, widthNew, heightNew)
  }

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
    inferenceResponse = ACTIVATION_MAPS_DEFAULT_VALUE
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
