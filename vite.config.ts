import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        game: 'game.html',
        end: 'end.html',
      },
    },
  },
  plugins: [tsconfigPaths()],
});
