from utils import parse_arguments
from onnx import load, save, helper, TensorProto

model_path, intermediate_node_names, _ = parse_arguments()

model = load(model_path)
graph = model.graph

existing_output_names = [o.name for o in graph.output]

min_value = helper.make_tensor("min_value", TensorProto.FLOAT, [], [0.0])
max_value = helper.make_tensor("max_value", TensorProto.FLOAT, [], [1.0])
bias_value = helper.make_tensor("bias_value", TensorProto.FLOAT, [], [0.05])
graph.initializer.extend([bias_value, min_value, max_value])

for vi in graph.value_info:
    if vi.name in intermediate_node_names and vi.name not in existing_output_names:
        biased_output_name = "Biased_" + vi.name
        final_output_name = "Visual_" + vi.name

        bias_node = helper.make_node(
            "Add",
            inputs=[vi.name, "bias_value"],
            outputs=[biased_output_name],
        )
        clip_node = helper.make_node(
            "Clip",
            inputs=[biased_output_name, "min_value", "max_value"],
            outputs=[final_output_name],
        )
        final_output = helper.make_tensor_value_info(
            final_output_name, TensorProto.FLOAT, None
        )
        graph.node.extend([bias_node, clip_node])
        graph.output.append(final_output)


save(model, model_path)
