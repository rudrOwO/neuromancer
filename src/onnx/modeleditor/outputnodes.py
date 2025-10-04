from utils import parse_arguments
from onnx import load, save

model_path, intermediate_node_names, _ = parse_arguments()

model = load(model_path)
graph = model.graph

existing_output_names = [o.name for o in graph.output]

for vi in graph.value_info:
    if vi.name in intermediate_node_names and vi.name not in existing_output_names:
        graph.output.append(vi)
        print(f"Appended output {vi.name} to graph")

save(model, model_path)
