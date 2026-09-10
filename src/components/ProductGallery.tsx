"use client";

import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeImage, setActiveImage] = useState(images[0]);
  return <div className="detail-gallery"><div className="thumbs">{images.map((image, index) => <button className={activeImage === image ? "active" : ""} onClick={() => setActiveImage(image)} key={`${image}-${index}`} aria-label={`View ${name} image ${index + 1}`}><img src={image} alt={`${name} view ${index + 1}`} /></button>)}</div><img className="detail-image" src={activeImage} alt={name} /></div>;
}
