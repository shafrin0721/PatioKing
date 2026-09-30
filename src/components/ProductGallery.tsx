"use client";

import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [zoom, setZoom] = useState(1);
  return <div className="detail-gallery"><div className="thumbs">{images.map((image, index) => <button className={activeImage === image ? "active" : ""} onClick={() => { setActiveImage(image); setZoom(1); }} key={`${image}-${index}`} aria-label={`View ${name} image ${index + 1}`}><img src={image} alt={`${name} view ${index + 1}`} /></button>)}</div><div className="detail-image-wrap"><img className="detail-image" style={{ transform: `scale(${zoom})` }} src={activeImage} alt={name} /><div className="image-zoom-controls" aria-label="Image zoom controls"><button type="button" onClick={() => setZoom((value) => Math.max(1, value - .25))} aria-label="Zoom out" title="Zoom out"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4.5 4.5M7.8 10.8h6" /></svg></button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom((value) => Math.min(2.5, value + .25))} aria-label="Zoom in" title="Zoom in"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4.5 4.5M10.8 7.8v6M7.8 10.8h6" /></svg></button></div></div></div>;
}
