# Patio King wardrobe — editable 3D model

Reference: the supplied single product photograph. This is an approximate visualization, not a production drawing. The unseen back/interior and exact measurements are inferred.

## Files

- `wardrobe.glb`: 3D model for web viewers, Blender import, and many AR workflows.
- `config.json`: editable overall dimensions and six finish colors (hex).
- `generate.py`: regenerates the GLB after changing the config; uses only Python 3 standard library.

Run `python3 generate.py config.json wardrobe.glb` from this folder. Dimensions are in millimetres. Every panel scales with the overall width, height and depth. Drawer height and toe kick have separate settings. Materials are named so they can also be adjusted in Blender or a web viewer. The mirror material is a metallic approximation; physically accurate reflections require an environment and renderer support.

The photo includes a brand watermark, but the model contains no branding. Obtain exact drawings and measurements before manufacturing or quoting. For precise fit, drawer hardware and joinery need a second design pass.
