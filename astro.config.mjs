// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import clerk from '@clerk/astro';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config.ts';

// The Vercel Marketplace provisions Clerk's key as NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
// Astro's Clerk SDK reads PUBLIC_CLERK_PUBLISHABLE_KEY, so accept either.
// The publishable key is public by design — it is safe to ship to the browser.
const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };
const publishableKey = env.PUBLIC_CLERK_PUBLISHABLE_KEY || env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',
  // The site stays fully static: Clerk runs client-side only (sign-in widget + user menu),
  // so no server adapter, middleware or secret key is needed.
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.includes('/login') }),
    clerk({
      publishableKey,
      signInUrl: '/login/',
      afterSignOutUrl: '/',
      // Theme Clerk's UI with the site's tokens so it follows the light/dark toggle.
      appearance: {
        variables: {
          colorPrimary: '#ec4899',
          colorBackground: 'var(--surface)',
          colorForeground: 'var(--text)',
          colorMutedForeground: 'var(--muted)',
          colorMuted: 'var(--surface-2)',
          colorInput: 'var(--surface-2)',
          colorInputForeground: 'var(--text)',
          colorBorder: 'var(--border-strong)',
          colorNeutral: 'var(--text)',
          fontFamily: 'Inter, system-ui, sans-serif',
          borderRadius: '10px',
        },
        elements: {
          socialButtonsBlockButton: { border: '1px solid var(--border-strong)' },
        },
      },
    }),
  ],
  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid', 'math'] },
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: false,
    },
  },
});
