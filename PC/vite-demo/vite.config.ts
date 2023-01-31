import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// https://cn.vitejs.dev/config/ 中文
export default defineConfig(async ({ command, mode, ssrBuild }) => {
    console.log('command: ', command );
    console.log('mode: ', mode);
    console.log('ssrBuild: ', ssrBuild);

    // 异步处理
    // const data = await fn();
    
    return {
        esbuild: {
            // 定义默认导入
            // jsxInject: `import { useState, useEffect } from 'react'`,
        },
      plugins: [react()],
    }
})
