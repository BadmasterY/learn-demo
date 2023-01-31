import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.less'

// 导入json
import { name, desc } from './assets/test.json';

// Glob导入, 同时导入多个模块
// eager 设置为 true 时, 不分包, 直接导入
// 路径必须是相对路径(./) 或者绝对路径(/)
const utils = import.meta.glob(['./utils/*.ts'], { eager: false });

function App() {
  const [count, setCount] = useState(0)
  const [moduleName, setModuleName] = useState('');

  useEffect(() => {
    console.log('init!', new Date())
    setModuleName('d')
    
    // console.log(utils);
    /**
     * log:
     * `{
     *    './utils/a.ts': () => import("/src/utils/a.ts"),
     *    './utils/b.ts': () => import("/src/utils/b.ts"),
     *    './utils/c.ts': () => import("/src/utils/c.ts"),
     *  }`
     */
  }, []);

  useEffect(() => {
    if(!moduleName) return;

    getModule()
  }, [moduleName]);

  /**
   * 获取module方法
   * @param fileName 文件名
   */
  const getModule = async (fileName = moduleName) => {
    const dynamicModule = await import(`./utils/${fileName}.ts`)

    console.log('dynamicModule: ', dynamicModule);
  }

  return (
    <div className="App">
      <div className='flex justify-center items-center'>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p>Author: {name}</p>
      <p>Description: {desc}</p>
    </div>
  )
}

export default App
