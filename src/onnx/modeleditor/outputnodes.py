from utils.modelname import timestamped_model_name
from utils.parseargs import parse_arguments

import onnx

model_path, intermediate_node_names, model_name = parse_arguments()

model = onnx.load(model_path)
graph = model.graph

existing_output_names = [o.name for o in graph.output]

for vi in graph.value_info:
    if vi.name in intermediate_node_names and vi.name not in existing_output_names:
        graph.output.append(vi)
        print(f"Appended output {vi.name} to graph")

onnx.save(model, timestamped_model_name(model_name))
