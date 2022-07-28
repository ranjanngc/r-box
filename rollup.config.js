import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import settings from './package.json'

export default {
  input: 'index.ts',
    output: [
        {
            file: `dist/r-box.v${settings.version}.es.js`,
            format: 'es'
        },
        {
            file: 'dist/r-box.cjs.js',
            format: 'cjs',
        },
        {
            file: `dist/r-box.v${settings.version}.es.min.js`,
            format: 'es',
            name: 'version',
            plugins: [terser()]
        }
    ],
    plugins: [typescript()]
};