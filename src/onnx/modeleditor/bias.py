from utils import parse_arguments
from onnx import load, save, helper, TensorProto

model_path, intermediate_node_names, _ = parse_arguments()

model = load(model_path)
graph = model.graph

existing_output_names = [o.name for o in graph.output]

bias_value = helper.make_tensor("bias_value", TensorProto.FLOAT, [], [0.05])
graph.initializer.append(bias_value)

for vi in graph.value_info:
    if vi.name in intermediate_node_names and vi.name not in existing_output_names:
        output_name = "Visual_" + vi.name
        add_bias_node = helper.make_node(
            "Add",
            inputs=[vi.name, "bias_value"],
            outputs=[output_name],
        )
        bias_output = helper.make_tensor_value_info(
            output_name, TensorProto.FLOAT, None
        )
        graph.node.append(add_bias_node)
        graph.output.append(bias_output)


save(model, model_path)
