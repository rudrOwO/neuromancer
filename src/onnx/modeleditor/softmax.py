from utils import parse_arguments, timestamped_model_name

import onnx
from onnx import TensorProto, helper

model_path, _, model_name, final_node_name = parse_arguments()

softmax_output_name = "Softmax_Output_0"
model = onnx.load(model_path)
graph = model.graph

# Fist remove the current final output
for o in graph.output:
    if o.name == final_node_name:
        graph.output.remove(o)

softmax_node = helper.make_node(
    "Softmax",
    inputs=[final_node_name],
    outputs=[softmax_output_name],
    axis=1,  # usually axis=1 for (N, C) classification outputs
    name="Softmax",
)

graph.node.append(softmax_node)

output_value_info = helper.make_tensor_value_info(
    softmax_output_name, TensorProto.FLOAT, None
)

graph.output.append(output_value_info)

onnx.save(model, timestamped_model_name(model_name))
