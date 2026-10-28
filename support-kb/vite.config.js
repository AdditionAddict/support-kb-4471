import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [
        vitePreprocess(),
        mdsvex({ extensions: ['.svx'], layout: { runbook: new URL('./src/lib/layouts/runbook.svelte', import.meta.url).pathname } }),
      ],
      adapter: adapter(),
      alias: { '#lib': 'src/lib' },
      prerender: { entries: ['*', '/kb/incidents/4471', '/kb/triage/dedupe', '/kb/decisions/0001-dedupe-by-subject'] },
    }),
  ],
});
