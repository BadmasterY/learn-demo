// 修改 create-react-app 默认行为
// 进行全局配置
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@primary-color': '#2d8cf0', // 全局主色
            '@body-background': '#f8f8f9',
            '@layout-header-background': 'rgba(0,0,0,0)', // header 背景色
        }
    }),
);