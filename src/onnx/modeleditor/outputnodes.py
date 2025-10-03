from datetime import datetime
from pathlib import Path

import onnx

# wow, what an intuitive syntax to move up 3 directories
model_path = Path(__file__).parents[3] / "public/mnist-12.onnx"

model = onnx.load(model_path)
graph = model.graph

intermediate_node_names = [
    "ReLU32_Output_0",
    "Pooling66_Output_0",
    "ReLU114_Output_0",
    "Pooling160_Output_0",
]

existing_output_names = [o.name for o in graph.output]

for vi in graph.value_info:
    if vi.name in intermediate_node_names and vi.name not in existing_output_names:
        graph.output.append(vi)
        print(f"Appended output {vi.name} to graph")

onnx.save(model, f"edited-model-{datetime.now().strftime('%d-%m-%Y-%H%M')}.onnx")
