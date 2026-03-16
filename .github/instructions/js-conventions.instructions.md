---
description: "Use when editing, adding, or reviewing JavaScript in app.js. Covers show/hide pattern, DOM manipulation, no-inline-styles rule, and WORKSHOPS config conventions."
applyTo: "js/**"
---
# JavaScript Conventions

## UI Visibility

Always use the `show(id)` / `hide(id)` helpers — never manipulate `.style` directly or toggle classes manually:

```js
// Correct
show("result-section");
hide("creds-block");

// Wrong — do not do this
document.getElementById("result-section").style.display = "block";
document.getElementById("creds-block").classList.toggle("hidden");
```

## No Inline Styles

All visual changes must go through CSS classes defined in `css/styles.css`. Never set `.style.*` properties in JS.

## WORKSHOPS Config

- `WORKSHOPS` object at the top of `app.js` is the single source of truth for workshop data.
- Each entry must have: `name`, `needsGroup` (boolean), and relevant URL fields.
- If `needsGroup: true`, add an `invalidGroups` array of `[lo, hi]` pairs (integers, not strings).
- Workshop keys are string integers (`"1"`, `"2"`, …) matching the `<option value>` in `index.html`.

## Credential Format

- Username pattern: `joulestudio-<groupNum>@sap.com` (see `showGroupResults` in `app.js`).
- Group numbers are always 3-digit zero-padded strings (`"001"`, `"042"`).
- Keep credential generation logic consistent with the existing `showGroupResults` function.

## Validation

- Group validation regex: `^\d{3}$`; valid range: 001–199.
- Invalid range errors use `invalidGroups` pairs; format boundary values with `.padStart(3, "0")`.
- Error text is set on `#group-error`; call `show("group-error")` / `hide("group-error")` to toggle it.
- Apply `input-error` / `input-ok` CSS classes to the input element for visual feedback.
