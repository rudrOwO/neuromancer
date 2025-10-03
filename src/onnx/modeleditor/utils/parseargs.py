import argparse


def parse_arguments():
    parser = argparse.ArgumentParser(exit_on_error=True)

    parser.add_argument(
        "model_path", type=str, help="The ABSOLUTE PATH to the input file (required)."
    )
    parser.add_argument(
        "--name", dest="model_name", type=str, help="Model name (required)"
    )
    parser.add_argument(
        "--nodes",
        dest="intermediate_node_names",
        type=str,
        nargs="*",
        default=[],
        help="List of intermediate node names that you wish to output",
    )

    args = parser.parse_args()

    return args.model_path, args.intermediate_node_names, args.model_name
