import onnx
import onnxruntime as ort
import numpy as np
from onnx import helper, TensorProto

# --- Step 1: Create base graph ---
input_tensor = helper.make_tensor_value_info("input", TensorProto.FLOAT, [1, 3, 28, 28])
output_tensor = helper.make_tensor_value_info(
    "relu_out_biased", TensorProto.FLOAT, [1, 3, 28, 28]
)

relu_node = helper.make_node("Relu", ["input"], ["relu_out"], name="Relu1")

# --- Step 2: Add constant bias tensor ---
bias_value = helper.make_tensor("bias_value", TensorProto.FLOAT, [], [0.05])

# --- Step 3: Add bias to the previous node output ---
add_bias_node = helper.make_node(
    "Add",
    inputs=["relu_out", "bias_value"],
    outputs=["relu_out_biased"],
    name="AddBias",
)

# --- Step 4: Build graph ---
graph = helper.make_graph(
    [relu_node, add_bias_node],
    "AddBiasExample",
    [input_tensor],
    [output_tensor],
    [bias_value],
)

# --- Step 5: Make model ---
model = helper.make_model(graph, opset_imports=[helper.make_opsetid("", 12)])
model.ir_version = 11

onnx.save(model, "/tmp/add_bias_example.onnx")
print("✅ Model saved as add_bias_example.onnx")

sess = ort.InferenceSession("/tmp/add_bias_example.onnx")
inp = np.random.uniform(-1, 1, (1, 3, 28, 28)).astype(np.float32)
out = sess.run(None, {"input": inp})[0]
print(out.min(), out.max())  # should all be ≥ 0.05
