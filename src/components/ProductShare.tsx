"use client";

import { useState } from "react";

type ProductShareProps = { productName: string };

type IconProps = { label: string };

function FacebookIcon({ label }: IconProps) {
  return <svg viewBox="0 0 24 24" aria-label={label} role="img"><path d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.7.3-1 1-1Z" /></svg>;
}

function InstagramIcon({ label }: IconProps) {
  return <svg viewBox="0 0 24 24" aria-label={label} role="img"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" className="share-icon-fill" /></svg>;
}

function TelegramIcon({ label }: IconProps) {
  return <svg viewBox="0 0 24 24" aria-label={label} role="img"><path d="m21.7 3.3-3.2 16.1c-.2 1.1-.8 1.4-1.7.9l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.3 13.2l-4.7-1.5c-1-.3-1-1 .2-1.5L20.2 3c.9-.3 1.7.2 1.5.3Z" /></svg>;
}

function WhatsAppIcon({ label }: IconProps) {
  return <svg viewBox="0 0 24 24" aria-label={label} role="img"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5Zm0 17a7.5 7.5 0 0 1-3.8-1l-.3-.2-2.8.8.8-2.7-.2-.3A7.5 7.5 0 1 1 12 19.5Zm4.1-5.6c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1l-.7.8c-.1.1-.2.1-.4 0a6.1 6.1 0 0 1-1.7-1.1 6.4 6.4 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.2.2-.3v-.3c0-.1-.5-1.2-.7-1.6-.2-.4-.4-.3-.5-.3h-.4c-.1 0-.3 0-.5.2-.2.2-.7.7-.7 1.8s.7 2 1 2.2c.1.2 1.4 2.2 3.4 3 .5.2.9.3 1.2.4.5.2.9.1 1.3.1.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.2-1 0-.1-.2-.2-.5-.3Z" /></svg>;
}

function CopyIcon({ label }: IconProps) {
  return <svg viewBox="0 0 24 24" aria-label={label} role="img"><rect x="8" y="8" width="11" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" /></svg>;
}

export function ProductShare({ productName }: ProductShareProps) {
  const [copied, setCopied] = useState(false);
  const getShareUrl = () => window.location.href;
  const shareText = `Take a look at ${productName} from Patio King.`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const shareToInstagram = async () => {
    await copyLink();
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  return <div className="product-share" aria-label="Share this product"><span>Share</span><div className="product-share-actions"><a className="share-facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`} target="_blank" rel="noreferrer" aria-label={`Share ${productName} on Facebook`} title="Share on Facebook"><FacebookIcon label="Facebook" /></a><button className="share-instagram" type="button" onClick={shareToInstagram} aria-label={`Share ${productName} on Instagram`} title="Copy link and open Instagram"><InstagramIcon label="Instagram" /></button><a className="share-telegram" href={`https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" aria-label={`Share ${productName} on Telegram`} title="Share on Telegram"><TelegramIcon label="Telegram" /></a><a className="share-whatsapp" href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${getShareUrl()}`)}`} target="_blank" rel="noreferrer" aria-label={`Share ${productName} on WhatsApp`} title="Share on WhatsApp"><WhatsAppIcon label="WhatsApp" /></a><button className="share-copy" type="button" onClick={copyLink} aria-label="Copy product link" title="Copy link"><CopyIcon label="Copy link" /></button></div>{copied && <small role="status">Link copied</small>}</div>;
}
