import { defineConfig } from 'vitest/config';
export default defineConfig({
  resolve: {
    alias: {
      '~': '/src',
      '~path': '/src/path',
    },
  },
  test: {
    clearMocks: true,
    environment: 'node',
    include: [
      '**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
  },
});
