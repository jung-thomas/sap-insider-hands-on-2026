---
description: "Update username or password patterns for workshop credentials. Targets showGroupResults and credential display logic in app.js only — does not touch layout or styling."
argument-hint: "Describe the new username/password format or pattern"
agent: "agent"
---
Update the credential generation logic for the SAP Insider workshop portal.

## Scope — strictly limited to

- `showGroupResults()` in [js/app.js](../../js/app.js) — where username is constructed and set on `#res-username`
- Any related credential fields rendered into the `#creds-block` result area
- The `#creds-block` HTML structure in [index.html](../../index.html) if new credential fields are needed

## Out of scope — do NOT change

- Validation logic (`validateGroupNumber`, `onGroupInput`, `onGroupBlur`)
- `WORKSHOPS` configuration object
- `show()` / `hide()` helpers
- Any CSS or layout
- Workshop 2 / `showWorkshop2Results` logic (unless explicitly requested)

## Implementation steps

1. Read the current `showGroupResults` function to understand the existing credential format.
2. Apply only the requested change (e.g. new username pattern, add a password field, change email domain).
3. If a new credential field is needed in the UI, add the corresponding element to `#creds-block` in `index.html` and wire up a `copyText()` call — following the exact pattern of the existing username row.
4. Keep credential construction co-located in `showGroupResults` — do not move logic elsewhere.

## Current credential pattern (reference)

```js
const username = "joulestudio-" + groupNum + "@sap.com";
// groupNum is always a 3-digit zero-padded string, e.g. "042"
```
