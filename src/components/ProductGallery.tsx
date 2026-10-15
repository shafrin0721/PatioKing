"use client";

import { useEffect, useRef, useState } from "react";
import { FurnitureViewer } from "./FurnitureViewer";
import type { FurnitureConfiguration, FurnitureProductSource } from "./FurnitureConfiguration";

type ProductGalleryProps = {
  images: string[];
  name: string;
  category: string;
  dimensions: FurnitureProductSource["dimensions"];
};

export function ProductGallery({ images, name, category, dimensions }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"photo" | "360">("photo");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageTriggerRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const activeImage = images[activeIndex] ?? images[0];
  const product: FurnitureProductSource = { id: name, name, category, image: activeImage, dimensions };
  const configuration: FurnitureConfiguration = {
    productId: name,
    category,
    width: dimensions.width || 80,
    length: dimensions.depth || 80,
    height: dimensions.height || 80,
    style: "Contemporary",
    material: "Premium Wood",
    finish: "Natural",
    upholstery: "Linen",
    capacity: "4 Seater",
    color: "Natural Wood",
    notes: "",
  };

  useEffect(() => {
    if (view !== "360") return;

    let attempts = 0;
    let timer: number;
    const synchronizeCanvas = () => {
      const canvas = modalRef.current?.querySelector("canvas");
      if (!canvas || canvas.width < canvas.clientWidth || canvas.height < canvas.clientHeight) {
        window.dispatchEvent(new Event("resize"));
        if (attempts++ < 12) timer = window.setTimeout(synchronizeCanvas, 100);
      }
    };

    timer = window.setTimeout(synchronizeCanvas, 100);
    return () => window.clearTimeout(timer);
  }, [view]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const imageTrigger = imageTriggerRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % images.length);
      }
      if (event.key === "0") {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
      if (event.key === "Tab") {
        const buttons = modalRef.current?.querySelectorAll("button");
        if (!buttons?.length) return;
        const firstButton = buttons[0];
        const lastButton = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === firstButton) {
          event.preventDefault();
          lastButton.focus();
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault();
          firstButton.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      imageTrigger?.focus();
    };
  }, [images.length, isOpen]);

  const changeImage = (index: number) => {
    setActiveIndex(index);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const openViewer = () => {
    setView("photo");
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsOpen(true);
  };
  const updateZoom = (nextZoom: number) => {
    setZoom(Math.max(1, Math.min(3, nextZoom)));
    if (nextZoom <= 1) setPan({ x: 0, y: 0 });
  };

  return <div className="detail-gallery">
    {images.length > 1 && <div className="thumbs">
      {images.map((image, index) => <button type="button" className={activeIndex === index ? "active" : ""} onClick={() => changeImage(index)} key={`${image}-${index}`} aria-label={`View ${name} image ${index + 1}`} aria-pressed={activeIndex === index}>
        <img src={image} alt={`${name} view ${index + 1}`} />
      </button>)}
    </div>}
    <div className="detail-image-wrap">
      <button ref={imageTriggerRef} className="detail-image-trigger" type="button" onClick={openViewer} aria-label={`View ${name} image ${activeIndex + 1} full screen`}>
        <img className="detail-image" src={activeImage} alt={name} />
      </button>
    </div>
    {isOpen && <div ref={modalRef} className="product-image-modal" role="dialog" aria-modal="true" aria-label={`${name} product viewer`} onClick={(event) => {
      if (event.target === event.currentTarget) setIsOpen(false);
    }}>
      <div className="product-image-modal-toolbar">
        <div className="product-view-tabs" role="tablist" aria-label="Product viewing mode">
          <button type="button" role="tab" aria-selected={view === "photo"} className={view === "photo" ? "active" : ""} onClick={() => setView("photo")}>Photo</button>
          <button type="button" role="tab" aria-selected={view === "360"} className={view === "360" ? "active" : ""} onClick={() => setView("360")}>360° view</button>
        </div>
        <button ref={closeButtonRef} className="product-image-modal-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close full-screen viewer">×</button>
      </div>
      {view === "photo" ? <>
        <div className="product-image-stage">
          {images.length > 1 && <button className="product-image-modal-previous" type="button" onClick={() => changeImage((activeIndex - 1 + images.length) % images.length)} aria-label="Previous image">‹</button>}
          <img
            src={activeImage}
            alt={`${name} image ${activeIndex + 1}`}
            draggable={false}
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, cursor: zoom > 1 ? "grab" : "zoom-in" }}
            onDoubleClick={() => updateZoom(zoom > 1 ? 1 : 2)}
            onPointerDown={(event) => {
              if (zoom === 1) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              dragRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
            }}
            onPointerMove={(event) => {
              const drag = dragRef.current;
              if (!drag) return;
              setPan({ x: drag.panX + event.clientX - drag.x, y: drag.panY + event.clientY - drag.y });
            }}
            onPointerUp={() => { dragRef.current = null; }}
            onPointerCancel={() => { dragRef.current = null; }}
          />
          {images.length > 1 && <button className="product-image-modal-next" type="button" onClick={() => changeImage((activeIndex + 1) % images.length)} aria-label="Next image">›</button>}
        </div>
        <div className="product-image-zoom-controls" aria-label="Image zoom controls">
          <button type="button" onClick={() => updateZoom(zoom - 0.5)} aria-label="Zoom out" disabled={zoom === 1}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => updateZoom(zoom + 0.5)} aria-label="Zoom in" disabled={zoom === 3}>+</button>
          <button type="button" onClick={() => updateZoom(1)} disabled={zoom === 1}>Reset</button>
          <small>Double-click or drag to explore</small>
        </div>
      </> : <div className="product-modal-360">
        <FurnitureViewer product={product} configuration={configuration} />
        <img className="product-360-reference" src={activeImage} alt={`Reference photo of ${name}`} />
        <p>Drag to rotate · Use the controls to zoom. Interactive 3D concept preview.</p>
      </div>}
    </div>}
  </div>;
}
