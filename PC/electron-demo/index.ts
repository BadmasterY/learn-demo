import {
    app,
    BrowserWindow,
    Notification,
    Menu,
    MenuItem,
    globalShortcut,
    ipcMain,
    nativeTheme,
} from 'electron';

// 禁用GPU加速
// app.disableHardwareAcceleration();

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            // offscreen: true, // 离屏渲染
        },
    });

    win.loadFile('./index.html');

    // // 离屏渲染
    // win.loadURL('http://github.com');
    // win.webContents.on('paint', (event, dir, image) => {
    //     // to do something....
    // });
    // // 设置帧率 30
    // win.webContents.setFrameRate(30);

    // 打开开发者工具
    win.webContents.openDevTools();

    // 任务栏进度
    win.setProgressBar(.5);

    // 提示框
    const notification = new Notification({
        title: '我是标题',
        body: '我是内容',
    });

    // 显示提示框
    notification.show();

    // 被点击回调
    notification.on('click', () => {
        console.log('哦吼, 你点我?');
    });

    // 仅在mac生效
    // 创建dock菜单
    const dockMenu = Menu.buildFromTemplate([
        {
            label: '新窗口',
            click() { console.log('创建新窗口') }
        },
        {
            label: '使用描述文件创建',
            submenu: [
                {
                    label: 'Basic',
                    click() { console.log('使用 Basic 创建窗口') }
                },
                {
                    label: 'Pro',
                    click() { console.log('使用 Pro 创建窗口') }
                }
            ]
        }
    ]);
    // 添加至app
    app.dock.setMenu(dockMenu);

    // 本地快捷键, 当前 app 处于焦点时
    const menu = new Menu();

    menu.append(new MenuItem({
        label: 'Print',
        accelerator: 'CommandOrControl+P',
        click() { console.log('print!') }
    }));

    // 非焦点时也触发快捷方式
    globalShortcut.register('CommandOrControl+X', () => {
        console.log('commandOrControl + X');
    });

    // 监听当前应用状态在线/离线
    // const onlineStatusWindow = new BrowserWindow({ width: 0, height: 0, show: false });
    // onlineStatusWindow.loadURL(`file://${__dirname}/online-status.html`);

    // 文件展示弹出菜单
    win.setRepresentedFilename('/etc/passwd');
    win.setDocumentEdited(true);
}

// 在初始化完成且准备好创建浏览器窗口时调用这个方法
// 部分 api 只能在 ready 之后触发
app.whenReady().then(createWindow);

// 当前所有窗口被关闭后退出
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // 在macOS上, 当单击dock图标并且没有其他窗口打开时
    // 打开一个新的窗口
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// 一些其他的代码
// 添加近期文件
app.addRecentDocument('/etc/passwd');

// 拖拽处理
ipcMain.on('ondragstart', (event, filePath: string) => {
    event.sender.startDrag({
        file: filePath,
        icon: '/path/to/icon.png'
    });
});

// macOS 自动暗色跟随
nativeTheme.on('updated', () => {
    console.log(nativeTheme.shouldUseDarkColors);
});
