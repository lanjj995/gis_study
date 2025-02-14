import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'

export default defineConfig((configEnv: ConfigEnv) => {
  
  const env = loadEnv(configEnv.mode, process.cwd(), '')
  
  return {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    plugins: [
      vue(),
      cesium({
        cesiumBaseUrl: env.VITE_CESIUM_BASE_URL
      })
    ],
  }
})
