# Repository Rhythm

This document defines a practical working rhythm for maintaining the Pamoja Outreach Foundation website in a clean, trustworthy, and sustainable way.

## Purpose

The site represents a real organization serving vulnerable people. That means every change should protect:

- factual accuracy
- visual quality
- operational reliability
- privacy and security

## Weekly Rhythm

Use this rhythm when the site is actively maintained.

### 1. Content Review

Check:

- leadership names and roles
- program descriptions
- contact details
- impact numbers
- calls to action

Only publish information that has been confirmed by the organization.

### 2. Asset Review

Check:

- image quality
- descriptive filenames
- alt text relevance
- file size and compression

Prefer optimized `.webp` images for large visuals where possible.

### 3. Technical Review

Check:

- links
- form behavior
- mobile navigation
- broken asset references
- Netlify redirect behavior

Any user-facing breakage should be fixed before content-only polish work.

### 4. Git Hygiene Review

Before pushing:

1. Run `git status`.
2. Review tracked changes carefully.
3. Confirm no `.env`, secret keys, local tool state, or temporary files are staged.
4. Make sure only intentional project files are included.

## Change Rhythm

### Content Changes

Use small, focused updates for:

- text edits
- new program copy
- updated impact numbers
- leadership or contact detail changes

### Design Changes

Group related styling work together so layout, spacing, and responsiveness are reviewed as one unit.

### Functional Changes

For anything affecting forms, scripts, redirects, or deployment behavior:

1. test locally
2. verify production assumptions
3. review for security impact
4. document the change in `README.md` if it changes project behavior

## Secret Handling Standard

This repository should never contain:

- real API keys
- production `.env` files
- private credentials
- exported dashboards or local tool state with tokens

Use:

- `.env.example` for documented placeholders
- Netlify environment variables for real deployment secrets
- `.gitignore` to block accidental commits

## Commit Standard

Good commits for this repository should be:

- small
- clear
- reviewable
- easy to roll forward from

Prefer messages that explain the purpose of the change, for example:

- `update README and repository hygiene docs`
- `fix missing contact form submission behavior`
- `refresh hero copy and program descriptions`

## Release Rhythm

For each production-facing update:

1. review the staged diff
2. preview locally
3. confirm no sensitive data is included
4. deploy to Netlify
5. smoke-test the live site

## Ongoing Cleanup List

The current repository would benefit from keeping these items on the radar:

- remove or resolve duplicated contact-handler maintenance burden
- add missing favicon assets or remove unused favicon references
- keep frontend contact submission behavior aligned with backend form handling
- continue improving documentation as deployment or content workflows evolve

## Definition Of Done

A change is ready when:

- the content is accurate
- the repo is clean
- no secrets are exposed
- the site still works on desktop and mobile
- the change is understandable from the diff alone
