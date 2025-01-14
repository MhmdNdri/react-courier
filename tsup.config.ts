import type { Options } from 'tsup'

export const tsup: Options = {
  splitting: true,
  clean: true, // clean up the dist folder
  dts: true, // generate dts files
  format: ['cjs', 'esm'], // generate cjs and esm files
  minify: false,
  bundle: true,
  skipNodeModulesBundle: true,
  entryPoints: ['package/index.ts'],
  watch: false,
  target: 'es2020',
  outDir: 'dist',
  entry: ['package/**/*.ts'], //include all files under src
}
