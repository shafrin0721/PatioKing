"use client";

import { useCallback, useState, useSyncExternalStore, type FormEvent } from "react";

type ProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const storageErrorSnapshot = "__product_review_storage_error__";

function reviewStorageKey(productId: string) {
  return `patio-king-reviews:${productId}`;
}

function getReviewSnapshot(productId: string) {
  try {
    return window.localStorage.getItem(reviewStorageKey(productId)) ?? "[]";
  } catch {
    return storageErrorSnapshot;
  }
}

function subscribeToReviews(productId: string, onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === reviewStorageKey(productId)) onChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener("product-reviews-updated", onChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("product-reviews-updated", onChange);
  };
}

function parseReviews(snapshot: string): ProductReview[] | null {
  if (snapshot === storageErrorSnapshot) return null;

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed) || !parsed.every(isProductReview)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function isProductReview(value: unknown): value is ProductReview {
  if (!value || typeof value !== "object") return false;
  const review = value as Record<string, unknown>;
  return typeof review.id === "string"
    && typeof review.name === "string"
    && Number.isInteger(review.rating)
    && Number(review.rating) >= 1
    && Number(review.rating) <= 5
    && typeof review.comment === "string"
    && typeof review.createdAt === "string";
}

function useProductReviews(productId: string) {
  const subscribe = useCallback((onChange: () => void) => subscribeToReviews(productId, onChange), [productId]);
  const getSnapshot = useCallback(() => getReviewSnapshot(productId), [productId]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  return { snapshot, reviews: parseReviews(snapshot) };
}

export function ProductRatingSummary({ productId, category, room }: { productId: string; category: string; room: string }) {
  const { reviews } = useProductReviews(productId);
  if (!reviews?.length) {
    return <div className="rating"><span aria-label="No ratings yet">☆☆☆☆☆</span><small>{reviews ? `No reviews yet · ${category} / ${room}` : "Ratings unavailable · saved in this browser"}</small></div>;
  }

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return <div className="rating">
    <span aria-label={`${average.toFixed(1)} out of 5 stars`}>{"★".repeat(Math.round(average))}{"☆".repeat(5 - Math.round(average))}</span>
    <small>{average.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"}) · {category} / {room}</small>
  </div>;
}

export function ProductFeedback({ productId }: { productId: string }) {
  const { snapshot, reviews } = useProductReviews(productId);
  const [status, setStatus] = useState("");
  const saveReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const comment = String(formData.get("comment") ?? "").trim();
    const rating = Number(formData.get("rating"));
    if (!name || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      setStatus("Please add your name, a 1–5 star rating, and a comment.");
      return;
    }
    if (reviews === null) {
      setStatus("Saved reviews could not be read, so a new review cannot be added.");
      return;
    }

    const updatedReviews = [
      { id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`, name, rating, comment, createdAt: new Date().toISOString() },
      ...reviews,
    ];
    try {
      window.localStorage.setItem(reviewStorageKey(productId), JSON.stringify(updatedReviews));
      window.dispatchEvent(new Event("product-reviews-updated"));
      form.reset();
      setStatus("Thank you. Your review has been saved in this browser.");
    } catch {
      setStatus("Your review could not be saved in this browser. Please check available storage and try again.");
    }
  };

  return <section className="product-feedback" aria-labelledby="product-feedback-title">
    <h3 id="product-feedback-title">Rate and review this product</h3>
    <form className="product-review-form" onSubmit={saveReview}>
      <label>Name<input name="name" type="text" autoComplete="name" maxLength={60} required /></label>
      <fieldset>
        <legend>Your rating</legend>
        <div className="review-rating-options">
          {[1, 2, 3, 4, 5].map((rating) => <label key={rating}>
            <input type="radio" name="rating" value={rating} required />
            <span aria-hidden="true">★</span>
            <span className="visually-hidden">{rating} {rating === 1 ? "star" : "stars"}</span>
          </label>)}
        </div>
      </fieldset>
      <label>Comment<textarea name="comment" rows={4} maxLength={1000} required /></label>
      <button type="submit">Submit review</button>
      <small>Reviews are saved in this browser only and are not shared with other visitors.</small>
      {status && <p className="review-form-status" role="status">{status}</p>}
    </form>
    <div className="feedback-list" aria-live="polite">
      <h3>Customer reviews</h3>
      {reviews === null || snapshot === storageErrorSnapshot
        ? <p className="review-empty" role="alert">Saved reviews could not be read from this browser.</p>
        : reviews.length === 0
          ? <p className="review-empty">No reviews yet. Be the first to leave one.</p>
          : reviews.map((review) => <article key={review.id}>
            <b>{review.name}</b>
            <span aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
            <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
            <p>{review.comment}</p>
          </article>)}
    </div>
  </section>;
}
