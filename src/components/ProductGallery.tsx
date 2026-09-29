"use client";

import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [zoom, setZoom] = useState(1);
  return <div className="detail-gallery"><div className="thumbs">{images.map((image, index) => <button className={activeImage === image ? "active" : ""} onClick={() => { setActiveImage(image); setZoom(1); }} key={`${image}-${index}`} aria-label={`View ${name} image ${index + 1}`}><img src={image} alt={`${name} view ${index + 1}`} /></button>)}</div><div className="detail-image-wrap"><img className="detail-image" style={{ transform: `scale(${zoom})` }} src={activeImage} alt={name} /><div className="image-zoom-controls" aria-label="Image zoom controls"><button type="button" onClick={() => setZoom((value) => Math.max(1, value - .25))} aria-label="Zoom out">−</button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom((value) => Math.min(2.5, value + .25))} aria-label="Zoom in">+</button></div></div></div>;
}
