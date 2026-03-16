---
description: "Add a new workshop to the portal. Patches WORKSHOPS in app.js and adds the <option> in index.html."
argument-hint: "Workshop name, day, URLs, group range (if needed)"
agent: "agent"
---
Add a new workshop to the SAP Insider hands-on portal.

## Required information (ask the user if not provided)

1. **Workshop key** — next available integer string (e.g. `"4"`)
2. **Display name** — shown in the `<select>` dropdown (e.g. `"Thursday – My Workshop Title"`)
3. **Needs group number?** — yes/no
4. **If yes**: invalid group ranges as `[lo, hi]` pairs (integers), and the Joule Studio URL
5. **If no**: system URL attendees should visit
6. **Exercise URL** — link to the exercise materials

## Implementation steps

1. Open [js/app.js](../../js/app.js) and add a new entry to the `WORKSHOPS` object following the exact structure of existing entries.
2. Open [index.html](../../index.html) and add a matching `<option value="<key>">` inside `#workshop-select`, keeping day-order (Tuesday before Wednesday, etc.).
3. Do **not** change any other logic — no new functions, no styling changes.
4. Validate: the new key in `WORKSHOPS` must exactly match the `value` attribute of the new `<option>`.

## Conventions to follow

- `invalidGroups` entries use integer boundaries, not strings: `[35, 38]` not `["035", "038"]`.
- Use CSS variables for any new UI — no hardcoded hex colors.
- If `needsGroup: false`, omit `invalidGroups` entirely.
- Workshop keys are consecutive string integers starting from `"1"`.
