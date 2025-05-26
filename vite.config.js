export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  server: {
    open: true,
  },
  base: "/", // <- CORREGIDO
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
});
