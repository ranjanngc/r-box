import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'index.ts',
    output: [
        {
            file: 'dist/r-box.v0.0.2.es.js',
            format: 'es'
        },
        {
            file: 'dist/r-box.cjs.js',
            format: 'cjs',
        },
        {
            file: 'dist/r-box.v0.0.2.min.es.js',
            format: 'es',
            name: 'version',
            plugins: [terser()]
        }
    ],
    plugins: [typescript()]
};