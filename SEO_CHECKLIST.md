# SEO Verification Checklist

Use this checklist after deployment to confirm the site remains indexable and canonical.

## Deployment Checks

- Confirm `https://www.rickyrecalcati.com` loads successfully.
- Confirm `https://rickyrecalcati.com` permanently redirects to `https://www.rickyrecalcati.com`.
- Confirm Vercel preview/default domains are not used as canonical URLs.
- Confirm canonical URLs use the `www.rickyrecalcati.com` domain.
- Confirm trailing slash variants do not create duplicate canonical URLs.

## Crawl Files

- Open `https://www.rickyrecalcati.com/robots.txt`.
- Confirm it allows public crawling and blocks only `/api/`.
- Confirm it references `https://www.rickyrecalcati.com/sitemap.xml`.
- Open `https://www.rickyrecalcati.com/sitemap.xml`.
- Confirm it includes homepage, Books, Articles, Resources, About, all book pages, all article pages and all resource pages.
- Confirm it excludes API routes, private routes and duplicate URLs.

## Metadata Spot Checks

Inspect page source or use URL Inspection for:

- Homepage
- `/books`
- One book or series page
- `/articles`
- One ordinary article
- One Balance Sheet issue
- `/resources`
- One resource page
- `/about`

For each page, confirm:

- Unique title.
- Unique meta description.
- Canonical URL.
- Open Graph title, description, URL and image.
- X/Twitter card metadata.
- JSON-LD appears once for each intended entity.

## Structured Data

Use Google Rich Results Test or Schema Markup Validator to check:

- Homepage WebSite and Person JSON-LD.
- Book pages.
- Article pages.
- Balance Sheet issue pages.
- Resource pages.
- BreadcrumbList on internal pages.
- ItemList on Books, Articles and Resources index pages.

## Discovery And Internal Links

- Confirm every article card uses a normal HTML link to its article page.
- Confirm every resource card uses a normal HTML link to its resource page.
- Confirm category filters do not remove article links from the server-rendered source.
- Confirm related reading/resource/book links resolve without 404s.

## Search Console

- Verify the domain property for `rickyrecalcati.com`.
- Submit `https://www.rickyrecalcati.com/sitemap.xml`.
- Use URL Inspection for a newly published article and resource.
- Request indexing for important new pages after deployment.
- Monitor Coverage/Indexing reports for canonical mismatch, blocked by robots, duplicate without canonical and 404 errors.
