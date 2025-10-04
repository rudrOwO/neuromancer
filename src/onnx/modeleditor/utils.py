import argparse
from datetime import datetime


def parse_arguments():
    parser = argparse.ArgumentParser(exit_on_error=True)

    parser.add_argument(
        "model_path", type=str, help="The ABSOLUTE PATH to the input file (required)."
    )
    parser.add_argument(
        "--name", dest="model_name", type=str, help="Model name (required)"
    )
    parser.add_argument(
        "--intermediate",
        dest="intermediate_node_names",
        type=str,
        nargs="*",
        default=[],
        help="List of intermediate node names that you wish to output",
    )
    parser.add_argument(
        "--final", dest="final_node_name", type=str, default="", help="Final node name"
    )

    args = parser.parse_args()

    return (
        args.model_path,
        args.intermediate_node_names,
        args.model_name,
        args.final_node_name,
    )


def timestamped_model_name(model_name: str):
    return f"{model_name}-{datetime.now().strftime('%d-%m-%Y-%H%M')}.onnx"
