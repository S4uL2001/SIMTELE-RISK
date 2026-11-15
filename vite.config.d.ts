export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: { port: 5173, host: true },
  base: '/SIMTELE-RISK-MODULO-4/', // 👈 Reemplaza con el nombre exacto de tu repositorio
  test: {
    // ...
  },
});