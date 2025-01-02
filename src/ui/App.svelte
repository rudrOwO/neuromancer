<script lang="ts">
  import Counter from "@components/Counter.svelte";
  import ONNXRuntime from "@onnx/entrypoint.ts?worker";

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

<main class="bg-slate-700 grid align-middle h-screen">
  <h1>Neuromancer</h1>
  <h3 class="font-mono my-5">Testing hot reload!</h3>

  <Counter />
</main>
