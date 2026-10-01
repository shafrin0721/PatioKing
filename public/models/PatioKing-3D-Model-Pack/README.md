# PatioKing 3D Model Pack

This pack was generated from the PatioKing furniture asset collection you supplied.

## Included

`models/` contains 16 category-specific GLB base models:

- Beds
- Bedside Cupboards
- Coffee tables
- Cupboards
- Dining chairs
- Dining tables
- Divan
- Dressing tables
- L sofas
- Pouf/Ottoman
- Relaxing chairs
- Rocking chairs
- Round sofa
- Single chairs
- Sofa
- TV console

`product-model-map.json` maps every supplied catalogue image to its category GLB.

## Important

These are **category-specific configurable base models**, not exact 1:1 reconstructions of every individual furniture SKU. A 2D product image does not contain enough information to reconstruct hidden/back/underside geometry exactly.

For the PatioKing configurator, use the mapping so a side-table/coffee-table/bed/sofa etc. never loads an unrelated generic chair model.

## Suggested project structure

Copy:

    models/*.glb

to:

    public/models/

and use:

    product-model-map.json

to resolve the selected product's category to its GLB.

## Recommended next step

For truly product-accurate previews, each distinct furniture SKU should have its own 3D model created from multiple product views or a supplied CAD/3D source. The shared React/Three.js configurator can remain the same; only the model mapping needs to change.
