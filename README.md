# SAP Insider Las Vegas 2026 - Workshop Access Portal

A GitHub Pages web application to help attendees of the SAP Insider Las Vegas 2026 conference access their hands-on workshop credentials and exercise materials.

## Live Site

Once deployed to GitHub Pages, the site will be available at:
`https://<username>.github.io/sap-insider-hands-on-2026/`

## Features

- Workshop selection for three available sessions
- Conditional group number input (workshops 1 & 3 only)
- Input validation with group number exclusion rules:
  - Workshop 1 (Tuesday – Joule Studio): groups 035–038 are invalid
  - Workshop 3 (Wednesday – Joule Studio): groups 008–011 are invalid
- Dynamic display of personalized credentials and links
- Copy-to-clipboard for username and password
- SAP branding with responsive design

## Workshops Supported

| # | Day | Title |
|---|-----|-------|
| 1 | Tuesday | Building AI Skills and Agents with Joule Studio |
| 2 | Wednesday | Getting Started with Joule for Developers |
| 3 | Wednesday | Building AI Skills and Agents with Joule Studio |

## Project Structure

```
├── index.html        # Main application page
├── css/
│   └── styles.css    # SAP-branded styles
└── js/
    └── app.js        # Application logic and validation
```

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select `Deploy from a branch`
4. Choose branch `main` and folder `/ (root)`
5. Click **Save**

The site will be live within a few minutes at the URL shown in Settings → Pages.

## Local Development

No build process required. Simply open `index.html` in a browser, or use a local server:

```bash
npx serve .
```

Then open `http://localhost:3000` in your browser.