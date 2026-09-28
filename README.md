# Pamoja Outreach Foundation Website

This repository contains the public website for **Pamoja Outreach Foundation**, a Kampala-based NGO serving vulnerable children, elderly persons, and families through community support, education assistance, and medical outreach.

The site is a lightweight static web project designed for Netlify deployment. It uses a single landing page, optimized image assets, and a serverless contact endpoint for form delivery.

## Project Overview

- **Site type:** Static NGO website / landing page
- **Deployment target:** Netlify
- **Frontend stack:** HTML, CSS, vanilla JavaScript
- **Backend touchpoint:** Netlify Function for contact form submission
- **Build step:** None

## What Is In This Repository

- `index.html`  
  The complete site markup, critical styles, structured data, and some inline behavior.
- `css/styles.min.css`  
  Main stylesheet used by the site.
- `js/main.min.js`  
  Frontend interactions such as navigation, counters, scrolling behavior, and form validation.
- `images/branding/`  
  Brand and program imagery used throughout the site.
- `netlify/functions/contact.js`  
  Netlify serverless function for sending contact messages through Resend.
- `api/contact.js`  
  A second contact handler using an Express-style `req/res` shape. It mirrors the Netlify function logic and should be kept in sync if both paths remain in use.
- `netlify.toml`  
  Netlify configuration, redirects, and cache headers.

## Repository Structure

```text
.
|-- api/
|   `-- contact.js
|-- css/
|   `-- styles.min.css
|-- images/
|   `-- branding/
|-- js/
|   `-- main.min.js
|-- netlify/
|   `-- functions/
|       `-- contact.js
|-- index.html
`-- netlify.toml
```

## Local Development

Because this is a static site, you can preview it with any simple local server.

Example options:

```bash
npx serve .
```

or

```bash
python -m http.server 8080
```

Then open the local URL in your browser.

## Contact Form Configuration

The repository includes a serverless email handler intended to send messages through **Resend**.

Required environment variables:

- `TO_EMAIL`
- `RESEND_API_KEY`

Create a local `.env` file from `.env.example` when testing with a local serverless setup. Do not commit real secrets.

## Netlify Deployment

This project is set up for root-directory publishing on Netlify:

- Publish directory: `.`
- Functions directory: `netlify/functions`
- Redirect: `/api/contact` -> `/.netlify/functions/contact`

The `netlify.toml` file also defines cache headers for images, CSS, JS, and general page responses.

## Git And Security Hygiene

This repository now includes:

- `.gitignore` to keep local secrets, Netlify state, editor files, and OS clutter out of Git
- `.gitattributes` to normalize text files and treat image assets as binary
- `.env.example` to document required environment variables without exposing real values

Before pushing changes, verify:

1. No `.env` files or API keys are staged.
2. No local Netlify state or editor folders are staged.
3. Images and content updates reflect real organizational information.
4. Both contact handlers stay aligned if either one is edited.

## Current Notes From Repository Review

During review, a few implementation details stood out:

- The site is intentionally simple and does not use a framework or package manifest.
- `index.html` references favicon PNG files that are not currently present in `images/branding/`.
- The frontend currently validates the contact form in the browser, while the serverless email handlers exist separately in the repository.

Those are not blockers for the documentation, but they are worth cleaning up in a later pass.

## Recommended Workflow

For this repository, the safest maintenance pattern is:

1. Make small content or design updates.
2. Preview locally.
3. Check `git status` before every commit.
4. Review staged changes carefully.
5. Deploy through Netlify after verification.

## Maintainers

The website content and mission belong to **Pamoja Outreach Foundation**.

Technical maintenance appears to be handled in this repository by the project owner/contributors.
