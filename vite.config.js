import { defineConfig } from 'vite'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    viteMockServe({  
      mockPath: "./src/mock",// 指向mock下的文件, 
      localEnabled: true, //  开发环境开启  监视mockPath对应的文件夹内文件中的更改
      logger: true,//是否打印日志
    }),

    AutoImport({
      include: [
        //导入目标文件类型
        /\.[tj]s(x|on)?$/, // .ts, .tsx, .js, .jsx .json
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        "vue",  
      ],
      dts: true,  
    }),
  ],
  resolve:{
    // Vite路径别名配置
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  }
})
