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

# Features
### Amount of Interactivity
- Show result of each executed Node in the z axis of the 3D view.
- Be able to change test samples from any stage and be able to see the effects.

### Run Types
- Quick Run: For a quick and clean ~~overview~~ show-off of the entire model run.
- Step-by-step Run: Like a debugger, examine each node parsed along with explanation panels.

### Nodes to be rendered:
- Input
- IntermediateOutput
- Conv
- Add
- Relu
- Maxpool
- Reshape?

> [!NOTE]
> Only IntermediateOutput Nodes need to be re-rendered?
