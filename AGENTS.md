# Astro Migration Project - BreakFreeNow

## Current State

- Astro v6.2.2 static site based on Astro blog starter template
- Content collections in `src/content.config.ts`:
  - `blog`: uses `glob` loader, schema has `title`, `description`, `author`, `image`, `date`, `updatedDate`, `heroImage`, `categories`, `tags`
  - `pages`: uses `glob` loader, schema has `title`, `date`
- Blog posts: 22 WordPress-exported posts in `src/content/blog/` with `year/month/slug/index.md` structure. Each post has an `images/` subfolder with featured and inline images
- Pages: 7 WordPress-exported pages in `src/content/pages/` with same structure:
  - `front_page` (renders as homepage), `blog` (skipped), `privacy-policy`, `about-me`, `cookie-policy`, `terms-of-service`, `my-philosophy`, `services`
- Homepage (`src/pages/index.astro`): renders `front_page` content from pages collection
- About page (`src/pages/about.astro`): removed, now served via dynamic route using exported `about-me` page
- Blog index (`src/pages/blog/index.astro`): sorts by `date`, renders posts with `heroImage`
- Blog post route (`src/pages/blog/[...slug].astro`): dynamic routing via `getStaticPaths` using `post.id`
- Pages route (`src/pages/[...slug].astro`): dynamic routing for all pages except `front_page` and `blog`
- Layouts: `BlogPost.astro` (for blog posts), `Page.astro` (for pages)
- Components: BaseHead, Footer, FormattedDate, Header, HeaderLink
  - Header: "Break Free Now" title, nav links (Home, Blog, About, Services, My Philosophy, Contact), LinkedIn + Facebook social icons
  - Footer: "David Vartanian" copyright, LinkedIn + Facebook social icons
- Contact form (`src/pages/contact-me.astro`): standalone page with form fields (Name, Email, Subject, Message, GDPR consent, Turnstile CAPTCHA)
- Contact form worker (`workers/contact-form/`): Cloudflare Worker that verifies Turnstile token and sends email via Resend API
- `src/consts.ts`: `SITE_TITLE = 'Break Free Now'`, updated description
- Styles: `src/styles/global.css` is Bear Blog default CSS with Atkinson font via Astro font provider
- `astro.config.mjs`: site set to `https://breakfreenow.co`, uses MDX and sitemap integrations
- Deployment: GitHub repo at `davidvartanian/breakfreenow`, GitHub Actions workflow at `.github/workflows/deploy.yml`
- Cloudflare Pages project: `breakfreenow`, custom domain `breakfreenow.co` configured
- Cloudflare Worker: `breakfreenow-contact-form` deployed at `breakfreenow-contact-form.david-vartanian.workers.dev`

## Completed Tasks

1. **Contact Form**
   - Turnstile site key added to `src/pages/contact-me.astro`
   - Worker secrets set: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`
   - GitHub repo secrets added: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - Worker tested and working

2. **GitHub Actions Deployment**
   - Workflow `.github/workflows/deploy.yml` created
   - Auto-deploys on push to main, verified working
   - Preview URL: https://cb737a03.breakfreenow.pages.dev

## Remaining Tasks

1. **Domain Switch**
   - WordPress site still serving at `breakfreenow.co`
   - Need to update DNS to point to Cloudflare Pages before switching traffic
   - May need CNAME record for `breakfreenow.co`

2. **Styling & Polish**
   - Improve overall design (currently minimal)
   - Better typography
   - Blog list page styling

## Project Structure

```
src/
  components/       # Astro components (Header, Footer, BaseHead, etc.)
  content/
    blog/           # 22 blog posts with images
    pages/          # 7 static pages (front_page, about-me, services, etc.)
  layouts/
    BlogPost.astro  # Blog post layout
    Page.astro      # Generic page layout
  pages/
    index.astro     # Homepage (renders front_page content)
    contact-me.astro # Contact form page
    [...slug].astro # Dynamic routing for pages
    blog/
      index.astro   # Blog listing
      [...slug].astro # Blog post routes
  styles/
    global.css      # Base styles
workers/
  contact-form/     # Cloudflare Worker for form processing
    src/index.ts
    wrangler.toml
    package.json
.github/workflows/
  deploy.yml        # GitHub Actions -> Cloudflare Pages
```

## Useful Commands
- `npm run dev`
- `npm run build`
- `npm run preview`
- `wrangler deploy --config workers/contact-form/wrangler.toml`
- `wrangler pages deploy dist --project-name=breakfreenow`

Project goal: Clean, fast, low-maintenance static blog.
