from argparse import ArgumentParser


def parse_arguments()->tuple[str, list[str], str]:
    parser = ArgumentParser(exit_on_error=True)

    parser.add_argument(
        "model_path", type=str, help="The ABSOLUTE PATH to the input file (required)."
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
        args.final_node_name,
    )
