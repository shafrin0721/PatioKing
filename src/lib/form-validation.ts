type RequiredFormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function getRequiredFieldError(form: HTMLFormElement) {
  const fields = form.querySelectorAll<RequiredFormField>("input[required], select[required], textarea[required]");
  const invalidField = Array.from(fields).find((field) => field.validity.valueMissing || !field.value.trim() || !field.validity.valid);

  if (!invalidField) return null;

  const label = invalidField.labels?.[0]?.textContent?.replace(/\s+/g, " ").trim().replace(/:$/, "") || "This";
  const message = invalidField.validity.valueMissing || !invalidField.value.trim()
    ? `Please fill out the ${label.toLowerCase()} field.`
    : `Please enter a valid ${label.toLowerCase()}.`;

  return { field: invalidField, message };
}

export function positionFieldError(form: HTMLFormElement, field: RequiredFormField) {
  const fieldLabel = field.closest("label");
  if (!fieldLabel) return;

  const formBounds = form.getBoundingClientRect();
  const labelBounds = fieldLabel.getBoundingClientRect();
  form.style.setProperty("--validation-top", `${field.getBoundingClientRect().bottom - formBounds.top + 4}px`);
  form.style.setProperty("--validation-left", `${labelBounds.left - formBounds.left}px`);
  form.style.setProperty("--validation-width", `${labelBounds.width}px`);
}
