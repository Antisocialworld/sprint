---
trigger: glob
description: whenever the agent creates or edits React components in Next.js
globs: bs:   - "src/components/**"   - "src/app/**" description: rules for React components, client boundaries, server components, and UI data fetching
---

1. Push "use client" directives to the lowest component level possible to keep client bundles small.
2. Data fetching must happen in Server Components, passing data down as props.