import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  content: {
    pipeline: {
      exclude: [
        'node_modules',
        'dist',
        '.git',
        '.husky',
        '.vscode',
        'public',
        'build',
        'mock',
        './stats.html',
      ],
    },
  },
  shortcuts: [
    ['flex-col', 'flex flex-col'],
    ['flex-x-center', 'flex justify-center'],
    ['flex-y-center', 'flex items-center'],
    ['flex-center', 'flex justify-center items-center'],
    // 宽高相同
    [/^wh-(.+)$/, ([, c]) => `w-${c}  h-${c}`],
  ],
  rules: [
    [
      /^clamp-(\d+)$/,
      ([, d]) => ({
        'display': '-webkit-box',
        '-webkit-box-orient': ' vertical',
        '-webkit-line-clamp': d,
        'overflow': 'hidden',
      }),
    ],
    [
      /^sd-(\d+)-(\d+)$/,
      ([, d, a]) => ({
        'box-shadow': `0 0 ${d}px rgba(0, 0, 0, 0.${a})`,
      }),
    ],
  ],
  theme: {
  },
  presets: [
    presetUno(),
    presetRemToPx(),
    presetAttributify(),
    // 配置以类名使用的 iconify
    presetIcons({
    }), // 以 CSS 方式使用 iconify
  ],
  safelist: [
  ], // 防止动态绑定误判为未使用，被 tree-shaking
  transformers: [
    transformerDirectives(), // @apply, @screen, @variants
    transformerVariantGroup(), // 样式分组
  ],
})

