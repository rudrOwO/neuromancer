---
id: plan
aliases: []
tags: []
---

# Target Models
For now, I will be doing a **hard-coded (fixed model)** visualizations for:
1. mnist
2. squeezenet/alexnet?

I'll try to **reuse Threlte components** between these models.

<br>

# TODO:
## Nodes to be rendered:
- Input
- Tensor
- TensorGrid
- Add?
- Relu?
- Maxpool?
- Feed Forward Perceptron

## Rendering Considerations
- Make threlte input rendering reactive to 2d input panel
- Use Three.js orbit controls?
- Render every activation map (8 for the first layer, 16 for the second)
- Make every activation map reactive
- When clicked, show 2D flat view with commentary

[!NOTE] Look at the outputs of the graph, not node parameters
