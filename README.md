# Curated x Catalina — An Editorial Travel Experience

A **homepage-only Next.js redesign concept** for [curatedxcatalina.com](https://www.curatedxcatalina.com/). Built as a deliberately designed, motion-led travel atelier — not a generic travel agency template.

The project keeps the site's **red / warm-neutral visual identity, real travel photography, principal homepage sections, service descriptions, founder story, journal titles and descriptions, and the five "Travel Should Feel Like..." statements.** The layout and motion are a proposed upgrade, not a pixel-for-pixel clone.

## Run on your Mac

Make sure [Node.js](https://nodejs.org/) **20.9 or newer** is installed (Node 22 or newer is recommended).

```bash
cd curated-x-catalina-homepage
npm install
npm run dev
```

Then open **http://localhost:3000**.

You can also double-click `run-on-mac.command` from Finder; macOS may ask you to approve opening the script the first time.

The code uses Next.js 16 (App Router), React 19, TypeScript, Motion for React, and hand-authored CSS. No Tailwind or component template is required.

## Experience / interaction notes

- **Hero:** cream background, two-line serif headline, one sentence, one primary action, and a wide coastal photograph with a soft clip reveal and gentle scroll parallax.
- **Services:** three real service photos with title, one-line description, and hover zoom.
- **About:** Catalina's portrait, short intro, and her real red signature.
- **Travel should feel like:** the five original statements as a simple list.
- **Journal:** compact index of the latest posts (category, title, date).
- **Closing:** red call-to-action band, then a minimal footer.
- **Site shell:** fixed header that gains a cream backdrop on scroll, mobile menu with Escape support, and `prefers-reduced-motion` support via Motion's `MotionConfig`.

## What is / isn't implemented

**This ZIP implements only the homepage.** The homepage itself works locally. Buttons for about, services, article details, contact, and FAQ intentionally open the **existing live website** in a new tab rather than pretending non-built pages are included. In-page anchors scroll to their real sections. Contact email opens the mail app.

**The design reuses the owner's real images.** To avoid altered or fabricated travel imagery, `lib/content.ts` contains direct source URLs on the Squarespace image CDN. These photographs require an internet connection. Fonts (Libre Baskerville + Almarai, the same families as the live site) are self-hosted at build time via `next/font`. Do not delete the original website / photo hosting unless you first download and relocate these images.

For production, copy the images you have rights to into `public/photography/`, update `lib/content.ts`, and replace remote URLs with local paths. You can also use `next/image` after the assets have been localized. Verify all photography usage rights with the owner before publishing.

## How to adjust the design

| Change | File |
| --- | --- |
| Colors, type, spacing, responsive styles | `app/globals.css` |
| Service labels, journal entries, URLs and image sources | `lib/content.ts` |
| All animation durations, sections, menu, layout | `components/HomeExperience.tsx` |
| Metadata | `app/layout.tsx` |

### Brand colors

- Warm ivory background: `#f5f0e8`
- Deep ink: `#282320`
- Vermilion red: `#bb3028`
- Deeper cream (about section): `#ece4d6`

## Quality / accessibility

- Semantic heading structure and descriptive image alt text.
- Keyboard-accessible buttons and links, visible focus rings, dismissible mobile menu.
- Reduced-motion handling for CSS animations and Motion transitions.
- No autoplaying video, tracking scripts, stock template widgets, or fake forms.
- Responsive layouts for mobile, tablet and desktop.

## Check before production launch

This is a design prototype, not a deployed replacement. Review mobile typography, final imagery, content and owner approval in your browser. Replace external links with actual Next.js routes if building the rest of the site. Set up hosting, contact workflows, analytics, testing, and image hosting as needed.

*Source copy and imagery reference: live homepage on 10 November 2026.*
