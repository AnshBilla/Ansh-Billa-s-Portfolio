# Ansh Billa — Personal Portfolio

A modern, responsive personal portfolio template for a software engineer. It uses only semantic HTML, custom CSS, and vanilla JavaScript—there are no framework, UI-library, font, or runtime dependencies.

> The name, biography, education details, links, and résumé are intentionally sample content. Search for `Ansh Billa` in `index.html` and replace the placeholder values with your own details before publishing.

## Features

- Premium dark-first design with an accessible persisted light mode
- Responsive layout for mobile, tablet, and desktop
- Sticky glass navigation, progress indicator, active-link tracking, and mobile menu
- Typing hero role, subtle floating effects, scroll reveals, and animated statistics
- Project cards with local SVG visual placeholders and native lazy loading
- Pointer-aware custom cursor, magnetic CTAs, dimensional project-card feedback, and restrained scroll parallax
- Animated skill-confidence bars plus an accessible, JavaScript-powered project explorer/filter
- Skill, education, and achievement timelines
- Semantic landmarks, visible focus states, skip link, ARIA labels, and reduced-motion support
- Client-side contact form validation with inline error messages
- Back-to-top action, smooth anchor scrolling, and no external network requests

## Folder structure

```text
.
├── index.html                         # Content and semantic page structure
├── style.css                          # Theme, layout, responsive styles, motion
├── script.js                          # Interactive behaviour and form validation
├── README.md
└── assets/
    ├── images/
    │   ├── profile-placeholder.svg
    │   ├── project-smartrahi.svg
    │   ├── project-iot.svg
    │   ├── project-expense.svg
    │   └── project-weather.svg
    ├── icons/                         # Add custom standalone icons here
    └── resume/
        └── Ansh Billa-Morgan-Resume.txt      # Replace with your downloadable résumé
```

## Technologies used

- HTML5
- CSS3 (custom properties, Grid, Flexbox, animations, media queries)
- Vanilla JavaScript (ES6+)
- Inline and local SVG artwork

## Run locally

No build step or package installation is required.

1. Open `index.html` directly in a modern browser, or
2. Serve the folder with a lightweight local server for the closest production behaviour. For example, if Python is installed:

   ```bash
   python -m http.server 8080
   ```

3. Open `http://localhost:8080`.

## Personalisation checklist

1. Replace the example name, title, introduction, university, counters, and contact email in `index.html`.
2. Update the GitHub, LinkedIn, LeetCode, project repository, and live-demo URLs.
3. Replace files in `assets/images/` with optimised WebP, AVIF, or SVG images while keeping the existing filenames (or update their `src` values).
4. Replace `assets/resume/Ansh Billa-Morgan-Resume.txt` with your actual PDF and point the Download résumé link at it.
5. Connect the contact form to your preferred form endpoint if you need real submissions. It currently validates client-side only, by design.

## Screenshots

Add screenshots after personalising the site:

| Desktop | Mobile |
| --- | --- |
| _Add a desktop screenshot here_ | _Add a mobile screenshot here_ |

## Deployment

This is a static site and can be deployed to GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static web host.

### GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and the repository root, then save.
4. Your published URL will be shown once deployment completes.

### Netlify or Vercel

1. Import the repository in the provider dashboard.
2. Leave the build command blank and set the output directory to `.` if requested.
3. Deploy. The host serves `index.html` automatically.

## License

This template is available under the [MIT License](https://opensource.org/license/mit/). Replace or add a `LICENSE` file before distributing your customised version.
