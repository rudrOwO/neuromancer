from datetime import datetime


def timestamped_model_name(model_name: str):
    return f"{model_name}-{datetime.now().strftime('%d-%m-%Y-%H%M')}.onnx"
