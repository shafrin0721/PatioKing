"use client";

type ConfirmationDialogProps = { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void };

export function ConfirmationDialog({ open, title, message, onConfirm, onCancel }: ConfirmationDialogProps) {
  if (!open) return null;
  return <div className="confirmation-overlay" role="presentation" onMouseDown={onCancel}><section className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmation-title" onMouseDown={(event) => event.stopPropagation()}><button className="confirmation-close" type="button" onClick={onCancel} aria-label="Close confirmation">x</button><span className="confirmation-kicker">Patio King</span><h2 id="confirmation-title">{title}</h2><p>{message}</p><div className="confirmation-actions"><button className="confirmation-cancel" type="button" onClick={onCancel}>Go back</button><button className="confirmation-confirm" type="button" onClick={onConfirm}>Continue to WhatsApp <span aria-hidden="true">-&gt;</span></button></div></section></div>;
}
