import { viteStaticCopy } from 'vite-plugin-static-copy';

export default {
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'html/*', // Source folder with .html files
          dest: 'html'   // Destination inside dist/html
        }
      ]
    })
  ],
  build: {
    outDir: 'dist', // Output directory
    rollupOptions: {
      input: {
        main: 'index.html' // Include index.html
      }
    }
  }
};
