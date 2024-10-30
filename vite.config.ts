import { resolve } from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import { createVitePlugins } from './build/vite'
// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()
// 路径查找
const pathResolve = (pathname: string) => resolve(root, '.', pathname)
// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any
  const isBuild = command === 'build'
  // 根据当前工作目录中的 mode 加载 .env 又件
  if (!isBuild) {
    env = loadEnv(process.argv[3] === '--mode' ? process.argv[4] : process.argv[3], root)
  } else {
    env = loadEnv(mode, root)
  }

  return {
    base: env.VITE_BASE_PATH,
    // vite 配置
    define: {
      __APP_ENV__: env.APP_ENV
    },
    server: {
      host: true,
      port: env.VITE_PORT, // 端口号
      open: env.VITE_OPEN === 'true',
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
    plugins: createVitePlugins({ command, mode }),
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
    build: {
      minify: 'terser',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      },
      rollupOptions: {
        // TODO: Prevent memory overflow
        maxParallelFileOps: 3,
        output: {
          // 入口文件名
          entryFileNames: 'assets/entry/[name]-[hash].js',
          manualChunks: {
            vue: ['vue', 'pinia', 'vue-router'],
            elementPlus: ['element-plus', '@element-plus/icons-vue'],
            echarts: ['echarts'] // 将 echarts 单独打包，参考 https://gitee.com/yudaocode/yudao-ui-admin-vue3/issues/IAB1SX 讨论
          }
        }
      }
    }
  }
}
