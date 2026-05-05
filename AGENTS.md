# Astro Migration Project - BreakFreeNow

## Current State

- Astro v6.2.2 project based on Astro blog starter template
- Content collections in `src/content.config.ts`:
  - `blog`: uses `glob` loader, schema has `title`, `description`, `author`, `image`, `date`, `updatedDate`, `heroImage`, `categories`, `tags`
  - `pages`: schema only (`title`, `date`), no loader defined yet
- Blog posts: 22 WordPress-exported posts in `src/content/blog/` with `year/month/slug/index.md` structure. Each post has an `images/` subfolder with featured and inline images
- Pages: 8 WordPress-exported pages already copied to `src/content/pages/` with same `year/month/slug/index.md` structure:
  - `front_page`, `blog`, `contact-me`, `privacy-policy`, `about-me`, `cookie-policy`, `terms-of-service`, `my-philosophy`, `services`
- Homepage (`src/pages/index.astro`): still Astro starter template content, not using exported `front_page` content
- About page (`src/pages/about.astro`): hardcoded lorem ipsum template, not using exported `about-me` page
- Blog index (`src/pages/blog/index.astro`): sorts by `pubDate` but blog schema uses `date` field (bug)
- Blog post route (`src/pages/blog/[...slug].astro`): dynamic routing works via `getStaticPaths` using `post.id`
- Layouts: only `BlogPost.astro`. No `Page.astro` layout yet
- Components: BaseHead, Footer, FormattedDate, Header, HeaderLink. All still contain Astro starter defaults (social links, site title)
- Contact form: exported contact form fields exist in `docs/wordpress-export/output/custom/wpcf7_contact_form/`, but no implementation in site
- `src/consts.ts`: `SITE_TITLE` and `SITE_DESCRIPTION` still have Astro starter defaults
- Styles: `src/styles/global.css` is Bear Blog default CSS with Atkinson font via Astro font provider
- `astro.config.mjs`: site set to `https://example.com`, uses MDX and sitemap integrations
- No deployment config yet

## Remaining Tasks

1. **Pages Collection**
   - Create `pages` collection in `src/content/config.ts`
   - Copy exported `pages/` folder to `src/content/pages/`
   - Create page layout (`src/layouts/Page.astro`)
   - Dynamic routing for pages

2. **Homepage**
   - Make `src/content/pages/2025/06/26/2025-05-26-front_page/index.md` the homepage (`src/pages/index.astro`)

3. **Contact Form**
   - Handle the contact page from exported `custom/` or `pages/`
   - Add working contact form (Cloudflare Turnstile or simple Formspree)

4. **Styling & Polish**
   - Improve overall design
   - Mobile responsiveness
   - Better typography

5. **Deployment**
   - GitHub Actions + Cloudflare Pages config

## Useful Commands
- `npm run dev`
- `npm run build`
- `npm run preview`

Project goal: Clean, fast, low-maintenance static blog.
