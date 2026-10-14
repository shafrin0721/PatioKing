"use client";

import { useEffect, useRef, useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageTriggerRef = useRef<HTMLButtonElement>(null);
  const activeImage = images[activeIndex] ?? images[0];

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

  return <div className="detail-gallery">
    {images.length > 1 && <div className="thumbs">
      {images.map((image, index) => <button type="button" className={activeIndex === index ? "active" : ""} onClick={() => setActiveIndex(index)} key={`${image}-${index}`} aria-label={`View ${name} image ${index + 1}`} aria-pressed={activeIndex === index}>
        <img src={image} alt={`${name} view ${index + 1}`} />
      </button>)}
    </div>}
    <div className="detail-image-wrap">
      <button ref={imageTriggerRef} className="detail-image-trigger" type="button" onClick={() => setIsOpen(true)} aria-label={`View ${name} image ${activeIndex + 1} full screen`}>
        <img className="detail-image" src={activeImage} alt={name} />
      </button>
    </div>
    {isOpen && <div ref={modalRef} className="product-image-modal" role="dialog" aria-modal="true" aria-label={`${name} product images`} onClick={(event) => {
      if (event.target === event.currentTarget) setIsOpen(false);
    }}>
      <button ref={closeButtonRef} className="product-image-modal-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close full-screen image">×</button>
      {images.length > 1 && <button className="product-image-modal-previous" type="button" onClick={() => setActiveIndex((index) => (index - 1 + images.length) % images.length)} aria-label="Previous image">‹</button>}
      <img src={activeImage} alt={`${name} image ${activeIndex + 1}`} />
      {images.length > 1 && <button className="product-image-modal-next" type="button" onClick={() => setActiveIndex((index) => (index + 1) % images.length)} aria-label="Next image">›</button>}
    </div>}
  </div>;
}
