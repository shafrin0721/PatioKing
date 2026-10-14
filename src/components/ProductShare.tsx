"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

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

function PinterestIcon({ label }: IconProps) {
  return <svg viewBox="0 0 24 24" aria-label={label} role="img"><path d="M12 3a8.5 8.5 0 0 0-3.1 16.4c-.1-1.4 0-3 .4-4.3l1.1-4.7s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.8 1.5 1.7 0 1-.6 2.4-.9 3.8-.3 1.1.6 2 1.7 2 2.1 0 3.7-2.2 3.7-5.3 0-2.8-2-4.8-5-4.8-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2 .8 2.5.1.1.1.2.1.4l-.3 1.1c-.1.4-.4.5-.8.3-1.5-.7-2.4-2.8-2.4-4.5C5.2 8.4 8 4.3 13 4.3c4.1 0 6.8 3 6.8 6.2 0 4.2-2.4 7.3-5.8 7.3-1.1 0-2.2-.6-2.6-1.3l-.7 2.7c-.3 1.3-1.1 2.9-1.6 3.9A8.5 8.5 0 1 0 12 3Z" /></svg>;
}

function WhatsAppIcon({ label }: IconProps) {
  return <svg viewBox="0 0 24 24" aria-label={label} role="img"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5Zm0 17a7.5 7.5 0 0 1-3.8-1l-.3-.2-2.8.8.8-2.7-.2-.3A7.5 7.5 0 1 1 12 19.5Zm4.1-5.6c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1l-.7.8c-.1.1-.2.1-.4 0a6.1 6.1 0 0 1-1.7-1.1 6.4 6.4 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.2.2-.3v-.3c0-.1-.5-1.2-.7-1.6-.2-.4-.4-.3-.5-.3h-.4c-.1 0-.3 0-.5.2-.2.2-.7.7-.7 1.8s.7 2 1 2.2c.1.2 1.4 2.2 3.4 3 .5.2.9.3 1.2.4.5.2.9.1 1.3.1.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.2-1 0-.1-.2-.2-.5-.3Z" /></svg>;
}

function CopyIcon({ label }: IconProps) {
  return <svg viewBox="0 0 24 24" aria-label={label} role="img"><rect x="8" y="8" width="11" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" /></svg>;
}

function ShareIcon({ label }: IconProps) {
  return <svg viewBox="0 0 24 24" aria-label={label} role="img"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.7 10.6 6.6-4.2m-6.6 7 6.6 4.2" /></svg>;
}

export function ProductShare({ productName }: ProductShareProps) {
  const pathname = usePathname();
  const shareUrl = new URL(pathname, "https://patiokingv2.com").toString();
  const [status, setStatus] = useState("");
  const shareText = `Take a look at ${productName} from Patio King.`;

  const copyLink = async (successMessage = "Link copied.") => {
    const url = shareUrl;
    let copied = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        copied = true;
      } catch {
        // Clipboard permissions can fail; try the browser's selection-based copy fallback.
      }
    }

    if (!copied) {
      const input = document.createElement("textarea");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      input.remove();
    }

    setStatus(copied ? successMessage : "Couldn't copy the link. Please copy the page URL from your browser.");
    window.setTimeout(() => setStatus(""), 3500);
    return copied;
  };

  const shareToInstagram = async () => {
    window.open("https://www.instagram.com/patio.king/", "_blank", "noopener,noreferrer");
    await copyLink("Link copied. Paste it into your Instagram post or message.");
  };

  const shareFromDevice = async () => {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({ title: productName, text: shareText, url: shareUrl });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("Unable to share this product from your device.");
    }
  };

  return <div className="product-share" aria-label="Share this product"><span>Share</span><div className="product-share-actions">
    <a className="share-facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${productName} on Facebook`} title="Share on Facebook"><FacebookIcon label="Facebook" /></a>
    <button className="share-instagram" type="button" onClick={shareToInstagram} aria-label={`Share ${productName} on Instagram`} title="Copy the link and open Instagram"><InstagramIcon label="Instagram" /></button>
    <a className="share-pinterest" href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${productName} on Pinterest`} title="Share on Pinterest"><PinterestIcon label="Pinterest" /></a>
    <a className="share-telegram" href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${productName} on Telegram`} title="Share on Telegram"><TelegramIcon label="Telegram" /></a>
    <a className="share-whatsapp" href={`https://wa.me/94773424994?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${productName} on WhatsApp`} title="Share on WhatsApp"><WhatsAppIcon label="WhatsApp" /></a>
    <button className="share-native" type="button" onClick={shareFromDevice} aria-label={`Share ${productName}`} title="Share using your device"><ShareIcon label="Share" /></button>
    <button className="share-copy" type="button" onClick={() => copyLink()} aria-label="Copy product link" title="Copy link"><CopyIcon label="Copy link" /></button>
  </div>{status && <small role="status">{status}</small>}</div>;
}
