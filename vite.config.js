import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      include: [
        /\.[tj]s(x|on)?$/, // .ts, .tsx, .js, .jsx .json
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        'vue',
        '@vueuse/core',
      ],
      dirs: ['src/composables'],
      dts: 'src/types/auto-imports.d.ts',
    }),
  ],
  resolve: {
    // Vite路径别名配置
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
})
