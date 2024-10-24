import { resolve } from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'
import IconsResolver from 'unplugin-icons/resolver'

import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'

import { unheadVueComposablesImports } from '@unhead/vue'

import tailwindcss from 'tailwindcss'
/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import { createHtmlPlugin } from 'vite-plugin-html'
import DevTools from 'vite-plugin-vue-devtools'
import { viteMockServe } from 'vite-plugin-mock'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 mode 加载 .env 又件
  // 设置第三个参数为·来加载所有环境变量，而不管是否有VITE_ 前缀
  const root = process.cwd()
  const env = loadEnv(mode, root, '')
  const isBuild = command === 'build'
  const pathResolve = (pathname: string) => resolve(root, '.', pathname)
  return {
    base: './',
    // vite 配置
    define: {
      __APP_ENV__: env.APP_ENV
    },
    server: {
      host: true,
      // http://localhost:5173/api/login -> http://www.test.com/login
      proxy: {
        //api是自行设置的请求前缀，任何请求路径以/api开头的请求将被代理到对应的target目标
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE, //目标域名
          changeOrigin: true, //需要代理跨域
          rewrite: (path) => path.replace(env.VITE_APP_BASE_API, '') //路径重写，把'/api'替换为''
        }
      }
    },
    plugins: [
      // https://github.com/posva/unplugin-vue-router
      VueRouter({
        extensions: ['.vue'],
        routesFolder: 'src/views',
        dts: 'src/types/typed-router.d.ts'
      }),
      tailwindcss,
      vue(),
      DevTools(),
      createHtmlPlugin({
        minify: isBuild
      }),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: [
          'vue',
          'pinia',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            'vue-router/auto': ['useLink'],
            '@/utils/i18n': ['i18n', 'locale'],
            'vue-i18n': ['useI18n']
          },
          unheadVueComposablesImports
        ],
        dirs: ['src/stores/modules'],
        // 生成自动导入的TS声明文件
        // dts: './auto-imports.d.ts',
        dts: 'src/types/auto-imports.d.ts',
        resolvers: [
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon'
          })
        ],
        eslintrc: {
          enabled: false // 1、改为true用于生成eslint配置。2、生成后改回false，避免重复生成消耗
        }
      }),
      Components({
        // 指定自动导入的组件位置，默认是 src/components
        dirs: ['src/components', 'src/otherComponents'],
        dts: 'src/types/auto-components.d.ts',
        resolvers: [
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'] //@iconify-json/ep 是 Element Plus 的图标库，所以 IconsResolver 配置了 enabledCollections: ['ep']
          })
        ]
      }),
      Icons({
        autoInstall: true
      }),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [
          {
            libraryName: 'element-plus',
            esModule: true,
            resolveStyle: (name) => {
              return `element-plus/theme-chalk/${name}.css`
            }
          }
        ]
      }),
      viteMockServe({
        ignore: /^_/,
        mockPath: 'mock',
        enable: !!env.VITE_APP_MOCK
      }),
      viteCompression({
        verbose: true, // 默认即可
        disable: false, // 开启压缩(不禁用)，默认即可
        deleteOriginFile: false, // 删除源文件
        threshold: 5120, // 压缩前最小文件大小
        algorithm: 'gzip', // 压缩算法
        ext: '.gz' // 文件类型
      })
    ],
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: pathResolve('src') + '/'
        },
        {
          find: /#\//,
          replacement: pathResolve('src/model') + '/'
        }
      ]
    },
    // esbuild: {
    //   drop: mode === 'production' ? ['console', 'debugger'] : []
    // },
    build: {
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        // TODO: Prevent memory overflow
        maxParallelFileOps: 3,
        output: {
          // 入口文件名
          entryFileNames: 'assets/entry/[name]-[hash].js',
          manualChunks: {
            vue: ['vue', 'pinia', 'vue-router'],
            elementPlus: ['element-plus', '@element-plus/icons-vue']
          }
        }
      }
    }
  }
})
