# Astro Migration Project - BreakFreeNow

## Current State

- Astro v6.2.2 static site based on Astro blog starter template
- Content collections in `src/content.config.ts`:
  - `blog`: uses `glob` loader, schema has `title`, `description`, `author`, `image`, `date`, `updatedDate`, `heroImage`, `categories`, `tags`
  - `pages`: uses `glob` loader, schema has `title`, `date`
- Blog posts: 26 WordPress-exported posts + 1 starter post in `src/content/blog/` with `year/month/slug/index.md` structure. Each post has an `images/` subfolder with featured and inline images
- Pages: 7 WordPress-exported pages in `src/content/pages/` with same structure:
  - `front_page` (renders as homepage), `blog` (skipped), `privacy-policy`, `about-me`, `cookie-policy`, `terms-of-service`, `my-philosophy`, `services`
- Homepage (`src/pages/index.astro`): Hero component + front_page content + LatestPosts component (6 latest posts)
- About page (`src/pages/about.astro`): removed, now served via dynamic route using exported `about-me` page
- Blog index (`src/pages/blog/index.astro`): sorts by `date`, renders posts with `heroImage`
- Blog post route (`src/pages/blog/[...slug].astro`): dynamic routing via `getStaticPaths` using `post.id`
- Pages route (`src/pages/[...slug].astro`): dynamic routing for all pages except `front_page` and `blog`
- Layouts: `BlogPost.astro` (for blog posts), `Page.astro` (for pages)
- Components: BaseHead, Footer, FormattedDate, Header, HeaderLink, Hero, LatestPosts
  - Header: "Break Free Now" title, nav links (Home, Blog, About with My Philosophy dropdown, Services, Contact), hamburger menu for mobile, LinkedIn + Facebook social icons
  - Footer: "David Vartanian" copyright, legal links (Privacy Policy, Cookie Policy, Terms of Service), LinkedIn + Facebook social icons
- Contact form (`src/pages/contact-me.astro`): standalone page with form fields (Name, Email, Subject, Message, GDPR consent, Turnstile CAPTCHA)
- Contact form worker (`workers/contact-form/`): Cloudflare Worker that verifies Turnstile token and sends email via Resend API
- `src/consts.ts`: `SITE_TITLE = 'Break Free Now'`, updated description
- Styles: `src/styles/global.css` is Bear Blog default CSS with Atkinson font via Astro font provider, accent color updated to warm orange
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
   - Preview URL: https://183100df.breakfreenow.pages.dev

3. **Featured Images**
   - Updated all 26 blog posts from `coverImage` to `heroImage` with relative paths
   - Blog list now shows thumbnails
   - Blog post view now shows hero image

4. **Footer Links**
   - Added Privacy Policy, Cookie Policy, Terms of Service links to footer

5. **Minimal Styling**
   - Updated accent color from blue to warm orange
   - Mobile nav improvements

6. **Duplicate Featured Images Fixed**
   - Removed inline featured image duplicates from 26 blog posts
   - These were a WordPress workaround where featured images were inserted into post content
   - Blog posts now show heroImage only once (via BlogPost.astro layout)

7. **Homepage Redesign**
   - Added Hero component with headline, subtitle, and CTA buttons
   - Added LatestPosts component showing 6 latest blog posts in a grid
   - Restructured front_page content to work with new hero layout

8. **Navigation Improvements**
   - Added dropdown sub-menu for "My Philosophy" under "About"
   - Added hamburger menu for mobile with CSS-only toggle
   - Added animated hamburger icon (transforms to X when open)

9. **Color Palette & Typography**
   - Updated to warm cream background (`#faf6f1`) appropriate for professional audience
   - Added supporting colors: accent-light, bg-cream, text-primary, text-secondary
   - Reduced body font size from 20px to 18px for better readability
   - Adjusted heading sizes: h1 2.5em, h2 2em, h3 1.5em
   - Added mobile font size adjustments (16px base on small screens)

10. **UI Components**
    - Added button styles with primary and secondary variants
    - Added form input styles with focus states (orange border + glow)
    - Improved link hover states with underline

11. **Featured Image Proportions**
    - Set blog post hero images to 16:9 aspect ratio (1020x575)
    - Added `object-fit: cover` for consistent cover-style appearance

12. **Mobile Responsiveness**
    - Header: hamburger menu with full-screen dropdown on mobile
    - Footer: legal links stack vertically on mobile
    - Contact form: improved input styling and mobile padding
    - Blog list: single column layout on mobile
    - LatestPosts grid: 3 columns on desktop, 1 column on mobile

## Remaining Tasks

1. **Domain Switch**
   - WordPress site still serving at `breakfreenow.co`
   - Need to update DNS to point to Cloudflare Pages before switching traffic
   - May need CNAME record for `breakfreenow.co`

2. **Image Quality Verification**
   - Verify image quality from exported content is acceptable
   - Some images may need replacement or re-export at higher quality

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
