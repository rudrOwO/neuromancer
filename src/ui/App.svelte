<script lang="ts">
  import Counter from "@components/Counter.svelte";
  import ONNXRuntime from "../onnx/entrypoint.ts?worker";

  $effect(() => {
    console.log(import.meta.env.VITE_PUBLIC_URL);

    const onnxRuntime = new ONNXRuntime();
    // Listen for messages from the worker
    onnxRuntime.onmessage = (event) => {
      console.log("Received from worker:", event.data);
    };

    // Send a message to the worker
    onnxRuntime.postMessage("Hello, Worker!");
  });
</script>

<main>
  <h1>Neuromancer</h1>

  <div class="card">
    <Counter />
  </div>

  <p>Hello</p>
</main>
