# Electron 面试指南

## 一、Electron 基础

### 1.1 什么是 Electron？

Electron 是一个使用 JavaScript、HTML 和 CSS 构建跨平台桌面应用程序的框架。它基于 Node.js 和 Chromium，允许开发者使用 Web 技术开发桌面应用。

**核心特点：**

- 跨平台：Windows、macOS、Linux
- 使用 Web 技术栈：HTML、CSS、JavaScript
- Node.js 集成：可访问文件系统、网络等
- 自动更新：内置自动更新机制
- 调试支持：完整的 DevTools

**知名应用案例：**

- VS Code
- GitHub Desktop
- Slack
- Discord
- Postman
- Figma

### 1.2 架构概述

```
┌─────────────────────────────────────────┐
│              主进程 (Main Process)       │
│  ┌─────────────────────────────────┐    │
│  │     Node.js Runtime             │    │
│  │  - 文件系统操作                  │    │
│  │  - 原生对话框                    │    │
│  │  - 系统托盘                      │    │
│  │  - 自动更新                      │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                    ↕ IPC 通信
┌─────────────────────────────────────────┐
│            渲染进程 (Renderer Process)   │
│  ┌─────────────────────────────────┐    │
│  │     Chromium + Web APIs        │    │
│  │  - HTML/CSS 渲染                │    │
│  │  - DOM 操作                     │    │
│  │  - 前端框架 (React/Vue)         │    │
│  │  - Web APIs                     │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**主进程与渲染进程的区别：**

| 特性     | 主进程         | 渲染进程             |
| -------- | -------------- | -------------------- |
| 数量     | 一个           | 多个（每个窗口一个） |
| 生命周期 | 应用启动到退出 | 窗口打开到关闭       |
| Node.js  | 完全访问       | 受限访问             |
| 原生能力 | 完全访问       | 通过 IPC 访问        |
| DOM      | 不可访问       | 可访问               |

### 1.3 快速开始

```bash
# 初始化项目
npm init -y
npm install electron --save-dev

# 创建主进程文件
# main.js
const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
```

---

## 二、主进程与渲染进程

### 2.1 主进程详解

```javascript
// main.js
const { app, BrowserWindow, Menu, Tray, ipcMain, dialog, shell } = require("electron");
const path = require("path");

class App {
    constructor() {
        this.mainWindow = null;
        this.tray = null;
    }

    createWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            minWidth: 800,
            minHeight: 600,
            title: "My Electron App",
            icon: path.join(__dirname, "icon.png"),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, "preload.js"),
                sandbox: true,
            },
        });

        // 加载页面
        this.mainWindow.loadFile("index.html");

        // 打开 DevTools（开发模式）
        if (process.env.NODE_ENV === "development") {
            this.mainWindow.webContents.openDevTools();
        }

        // 窗口事件
        this.mainWindow.on("maximize", () => {
            console.log("窗口最大化");
        });

        this.mainWindow.on("unmaximize", () => {
            console.log("窗口退出最大化");
        });

        this.mainWindow.on("close", (event) => {
            // 阻止关闭，弹出确认对话框
            event.preventDefault();
            this.mainWindow.webContents.send("before-close");
        });
    }

    createMenu() {
        const template = [
            {
                label: "文件",
                submenu: [
                    {
                        label: "新建",
                        accelerator: "CmdOrCtrl+N",
                        click: () => this.mainWindow.webContents.send("menu-new"),
                    },
                    { type: "separator" },
                    {
                        label: "打开",
                        accelerator: "CmdOrCtrl+O",
                        click: async () => {
                            const result = await dialog.showOpenDialog(this.mainWindow, {
                                properties: ["openFile"],
                                filters: [
                                    { name: "文本文件", extensions: ["txt", "md"] },
                                    { name: "所有文件", extensions: ["*"] },
                                ],
                            });
                            if (!result.canceled) {
                                this.mainWindow.webContents.send("file-opened", result.filePaths[0]);
                            }
                        },
                    },
                    { type: "separator" },
                    { role: "quit" },
                ],
            },
            {
                label: "编辑",
                submenu: [
                    { role: "undo" },
                    { role: "redo" },
                    { type: "separator" },
                    { role: "cut" },
                    { role: "copy" },
                    { role: "paste" },
                    { role: "selectAll" },
                ],
            },
            {
                label: "视图",
                submenu: [
                    { role: "reload" },
                    { role: "forceReload" },
                    { role: "toggleDevTools" },
                    { type: "separator" },
                    { role: "resetZoom" },
                    { role: "zoomIn" },
                    { role: "zoomOut" },
                    { type: "separator" },
                    { role: "togglefullscreen" },
                ],
            },
            {
                label: "帮助",
                submenu: [
                    {
                        label: "关于",
                        click: () => {
                            dialog.showMessageBox(this.mainWindow, {
                                type: "info",
                                title: "关于",
                                message: "My Electron App",
                                detail: "版本 1.0.0",
                            });
                        },
                    },
                ],
            },
        ];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    createTray() {
        this.tray = new Tray(path.join(__dirname, "tray-icon.png"));

        const contextMenu = Menu.buildFromTemplate([
            { label: "显示窗口", click: () => this.mainWindow.show() },
            { label: "隐藏窗口", click: () => this.mainWindow.hide() },
            { type: "separator" },
            {
                label: "退出",
                click: () => {
                    this.mainWindow.destroy();
                    app.quit();
                },
            },
        ]);

        this.tray.setToolTip("My Electron App");
        this.tray.setContextMenu(contextMenu);

        this.tray.on("click", () => {
            this.mainWindow.isVisible() ? this.mainWindow.hide() : this.mainWindow.show();
        });
    }
}

const myApp = new App();

app.whenReady().then(() => {
    myApp.createWindow();
    myApp.createMenu();
    myApp.createTray();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        myApp.createWindow();
    }
});
```

### 2.2 渲染进程详解

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>My Electron App</title>
    </head>
    <body>
        <h1>Hello Electron</h1>
        <button id="openFile">打开文件</button>
        <button id="saveFile">保存文件</button>
        <div id="content"></div>

        <script>
            const { ipcRenderer } = require("electron");

            // 监听主进程消息
            ipcRenderer.on("menu-new", () => {
                document.getElementById("content").innerHTML = "";
            });

            ipcRenderer.on("file-opened", (event, filePath) => {
                document.getElementById("content").innerHTML = `打开的文件: ${filePath}`;
            });

            ipcRenderer.on("before-close", () => {
                const confirmed = confirm("确定要退出吗？");
                if (confirmed) {
                    ipcRenderer.send("confirm-close");
                }
            });

            // 发送消息给主进程
            document.getElementById("openFile").addEventListener("click", () => {
                ipcRenderer.send("open-file-dialog");
            });

            document.getElementById("saveFile").addEventListener("click", () => {
                ipcRenderer.invoke("save-file-dialog", { content: "Hello World" });
            });

            // 使用 invoke/promise 方式
            ipcRenderer.invoke("get-app-version").then((version) => {
                console.log("App version:", version);
            });
        </script>
    </body>
</html>
```

### 2.3 预加载脚本（Preload）

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// 安全地暴露 API 给渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
    // 发送消息
    send: (channel, data) => {
        const validChannels = ["open-file-dialog", "save-file", "confirm-close"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },

    // 接收消息
    on: (channel, callback) => {
        const validChannels = ["menu-new", "file-opened", "before-close"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => callback(...args));
        }
    },

    // 异步调用（带返回值）
    invoke: async (channel, ...args) => {
        const validChannels = ["get-app-version", "save-file-dialog"];
        if (validChannels.includes(channel)) {
            return await ipcRenderer.invoke(channel, ...args);
        }
    },

    // 移除监听
    removeListener: (channel, callback) => {
        ipcRenderer.removeListener(channel, callback);
    },
});
```

---

## 三、进程间通信（IPC）

### 3.1 IPC 通信方式

```javascript
// main.js - 主进程
const { ipcMain } = require("electron");

// 方式一：ipcRenderer.send + ipcMain.on（单向）
ipcMain.on("open-file-dialog", (event) => {
    // 主进程处理
    dialog.showOpenDialog({ properties: ["openFile"] });
});

// 方式二：ipcRenderer.invoke + ipcMain.handle（双向，带返回值）
ipcMain.handle("get-app-version", async (event) => {
    return app.getVersion();
});

ipcMain.handle("save-file-dialog", async (event, options) => {
    const result = await dialog.showSaveDialog({
        defaultPath: options.defaultPath,
        filters: [{ name: "文本文件", extensions: ["txt"] }],
    });
    if (!result.canceled) {
        const fs = require("fs");
        fs.writeFileSync(result.filePath, options.content);
        return { success: true, filePath: result.filePath };
    }
    return { success: false };
});

// 方式三：webContents.send（主进程主动发送）
// 在主进程中
mainWindow.webContents.send("update-progress", progress);

// 在渲染进程中
ipcRenderer.on("update-progress", (event, progress) => {
    console.log("Update progress:", progress);
});
```

```javascript
// preload.js - 预加载脚本
contextBridge.exposeInMainWorld("electronAPI", {
    // invoke 方式（推荐）
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),

    // send 方式
    send: (channel, data) => ipcRenderer.send(channel, data),

    // on 方式
    on: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args));
    },
});
```

```javascript
// renderer.js - 渲染进程
// 调用主进程方法
const version = await window.electronAPI.invoke("get-app-version");

// 发送消息给主进程
window.electronAPI.send("open-file-dialog");

// 监听主进程消息
window.electronAPI.on("update-progress", (progress) => {
    console.log(progress);
});
```

### 3.2 IPC 通信最佳实践

```javascript
// 定义所有 IPC 通道
// constants/ipcChannels.js
const ipcChannels = {
    // 文件操作
    FILE_OPEN: "file:open",
    FILE_SAVE: "file:save",
    FILE_READ: "file:read",
    FILE_WRITE: "file:write",

    // 应用操作
    APP_GET_VERSION: "app:get-version",
    APP_GET_PATH: "app:get-path",
    APP_SHOW_NOTIFICATION: "app:show-notification",

    // 窗口操作
    WINDOW_MINIMIZE: "window:minimize",
    WINDOW_MAXIMIZE: "window:maximize",
    WINDOW_CLOSE: "window:close",

    // 数据操作
    DB_QUERY: "db:query",
    DB_INSERT: "db:insert",
};

module.exports = { ipcChannels };
```

---

## 四、窗口管理

### 4.1 BrowserWindow 配置

```javascript
// 基础配置
const mainWindow = new BrowserWindow({
    width: 1200, // 窗口宽度
    height: 800, // 窗口高度
    minWidth: 800, // 最小宽度
    minHeight: 600, // 最小高度
    x: 100, // 窗口 x 坐标
    y: 100, // 窗口 y 坐标
    center: true, // 是否居中显示
    movable: true, // 是否可移动
    resizable: true, // 是否可调整大小
    minimizable: true, // 是否可最小化
    maximizable: true, // 是否可最大化
    closable: true, // 是否可关闭
    focusable: true, // 是否可获取焦点
    alwaysOnTop: false, // 是否始终在最顶层
    fullscreen: false, // 是否全屏
    fullscreenable: true, // 是否可进入全屏
    title: "My App", // 窗口标题
    icon: "icon.png", // 窗口图标
    frame: true, // 是否显示原生窗口边框
    transparent: false, // 是否透明背景
    backgroundColor: "#ffffff", // 背景色
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
        sandbox: true,
    },
});
```

### 4.2 多窗口管理

```javascript
// main.js
class WindowManager {
    constructor() {
        this.windows = new Map();
    }

    createMainWindow() {
        const mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
        });

        mainWindow.loadFile("index.html");

        mainWindow.on("closed", () => {
            this.windows.delete("main");
        });

        this.windows.set("main", mainWindow);
        return mainWindow;
    }

    createSettingsWindow() {
        if (this.windows.has("settings")) {
            this.windows.get("settings").focus();
            return;
        }

        const settingsWindow = new BrowserWindow({
            width: 600,
            height: 400,
            parent: this.windows.get("main"), // 设置父窗口
            modal: true, // 模态窗口
            resizable: false,
        });

        settingsWindow.loadFile("settings.html");

        settingsWindow.on("closed", () => {
            this.windows.delete("settings");
        });

        this.windows.set("settings", settingsWindow);
    }

    createDetachedWindow(url, options = {}) {
        const detachedWindow = new BrowserWindow({
            width: options.width || 800,
            height: options.height || 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, "preload.js"),
            },
        });

        detachedWindow.loadURL(url);

        return detachedWindow;
    }

    getMainWindow() {
        return this.windows.get("main");
    }

    closeAllWindows() {
        this.windows.forEach((window) => {
            window.destroy();
        });
        this.windows.clear();
    }
}
```

---

## 五、系统集成

### 5.1 系统通知

```javascript
// main.js
const { Notification } = require("electron");

function showNotification(title, body) {
    if (Notification.isSupported()) {
        const notification = new Notification({
            title: title,
            body: body,
            icon: path.join(__dirname, "icon.png"),
            silent: false,
            urgency: "normal",
        });

        notification.on("click", () => {
            console.log("通知被点击");
            mainWindow.show();
            mainWindow.focus();
        });

        notification.show();
    }
}
```

### 5.2 系统托盘

```javascript
// main.js
const { Tray, Menu, nativeImage } = require("electron");

class TrayManager {
    constructor() {
        this.tray = null;
    }

    createTray() {
        // 创建图标
        const icon = nativeImage.createFromPath("tray-icon.png");
        this.tray = new Tray(icon);

        const contextMenu = Menu.buildFromTemplate([
            {
                label: "显示主窗口",
                click: () => {
                    const mainWindow = BrowserWindow.getAllWindows()[0];
                    mainWindow.show();
                },
            },
            {
                label: "快速操作",
                submenu: [
                    { label: "新建文件", click: () => this.createNewFile() },
                    { label: "打开文件夹", click: () => this.openFolder() },
                ],
            },
            { type: "separator" },
            {
                label: "关于",
                click: () => {
                    dialog.showMessageBox({
                        type: "info",
                        title: "关于",
                        message: "My Electron App v1.0.0",
                    });
                },
            },
            { type: "separator" },
            {
                label: "退出",
                click: () => {
                    app.quit();
                },
            },
        ]);

        this.tray.setToolTip("My Electron App");
        this.tray.setContextMenu(contextMenu);

        // 左键点击
        this.tray.on("click", () => {
            const mainWindow = BrowserWindow.getAllWindows()[0];
            if (mainWindow.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow.show();
            }
        });
    }

    destroyTray() {
        if (this.tray) {
            this.tray.destroy();
            this.tray = null;
        }
    }
}
```

### 5.3 剪切板

```javascript
// main.js
const { clipboard } = require("electron");

// 写入文本
clipboard.writeText("Hello, Electron!");

// 读取文本
const text = clipboard.readText();

// 写入 HTML
clipboard.writeHTML("<b>Hello</b>");

// 读取 HTML
const html = clipboard.readHTML();

// 清空
clipboard.clear();

// 写入图片
const { nativeImage } = require("electron");
const image = nativeImage.createFromPath("image.png");
clipboard.writeImage(image);

// 读取图片
const pastedImage = clipboard.readImage();
```

### 5.4 全局快捷键

```javascript
// main.js
const { globalShortcut } = require("electron");

function registerGlobalShortcuts() {
    // 注册全局快捷键
    globalShortcut.register("CommandOrControl+Shift+P", () => {
        console.log("Global shortcut triggered");
        // 显示/隐藏主窗口
        const mainWindow = BrowserWindow.getAllWindows()[0];
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });

    // 注册媒体快捷键
    globalShortcut.register("MediaPlayPause", () => {
        // 播放/暂停
    });

    globalShortcut.register("MediaNextTrack", () => {
        // 下一曲
    });

    globalShortcut.register("MediaPreviousTrack", () => {
        // 上一曲
    });
}

// 检查快捷键是否已注册
const isRegistered = globalShortcut.isRegistered("CommandOrControl+Shift+P");

// 卸载快捷键
globalShortcut.unregister("CommandOrControl+Shift+P");

// 卸载所有快捷键
globalShortcut.unregisterAll();
```

---

## 六、打包与分发

### 6.1 electron-builder 配置

```json
// package.json
{
    "build": {
        "appId": "com.myapp.myelectronapp",
        "productName": "My Electron App",
        "copyright": "Copyright © 2024",
        "directories": {
            "output": "dist",
            "buildResources": "build"
        },
        "files": ["dist/**/*", "package.json"],
        "extraMetadata": {
            "main": "dist/main.js"
        },
        "win": {
            "target": [
                {
                    "target": "nsis",
                    "arch": ["x64", "ia32"]
                },
                {
                    "target": "portable",
                    "arch": ["x64"]
                }
            ],
            "icon": "build/icon.ico",
            "artifactName": "${productName}-${version}-${arch}.${ext}"
        },
        "mac": {
            "target": ["dmg", "zip"],
            "icon": "build/icon.icns",
            "category": "public.app-category.developer-tools",
            "hardenedRuntime": true,
            "gatekeeperAssess": false,
            "entitlements": "build/entitlements.mac.plist",
            "entitlementsInherit": "build/entitlements.mac.plist"
        },
        "linux": {
            "target": ["AppImage", "deb", "rpm"],
            "icon": "build/icons",
            "category": "Development"
        },
        "nsis": {
            "oneClick": false,
            "perMachine": false,
            "allowToChangeInstallationDirectory": true,
            "deleteAppDataOnUninstall": false,
            "installerIcon": "build/icon.ico",
            "uninstallerIcon": "build/icon.ico",
            "installerHeaderIcon": "build/icon.ico"
        },
        "publish": {
            "provider": "github",
            "owner": "myusername",
            "repo": "my-electron-app"
        }
    }
}
```

### 6.2 自动更新

```javascript
// main.js
const { autoUpdater } = require("electron-updater");

class Updater {
    constructor() {
        this.autoUpdater = autoUpdater;

        // 配置
        this.autoUpdater.autoDownload = false;
        this.autoUpdater.autoInstallOnAppQuit = true;

        // 事件监听
        this.autoUpdater.on("checking-for-update", () => {
            console.log("检查更新中...");
        });

        this.autoUpdater.on("update-available", (info) => {
            console.log("有新版本:", info.version);
            dialog
                .showMessageBox({
                    type: "info",
                    title: "发现新版本",
                    message: `新版本 ${info.version} 可用，是否下载？`,
                    buttons: ["下载", "稍后"],
                })
                .then((result) => {
                    if (result.response === 0) {
                        this.autoUpdater.downloadUpdate();
                    }
                });
        });

        this.autoUpdater.on("update-not-available", () => {
            console.log("当前是最新版本");
        });

        this.autoUpdater.on("download-progress", (progress) => {
            console.log(`下载进度: ${progress.percent}%`);
            mainWindow.webContents.send("update-progress", progress.percent);
        });

        this.autoUpdater.on("update-downloaded", () => {
            dialog
                .showMessageBox({
                    type: "info",
                    title: "下载完成",
                    message: "更新已下载，将在退出时安装。",
                    buttons: ["立即退出", "稍后"],
                })
                .then((result) => {
                    if (result.response === 0) {
                        this.autoUpdater.quitAndInstall();
                    }
                });
        });

        this.autoUpdater.on("error", (error) => {
            console.error("更新错误:", error);
        });
    }

    checkForUpdates() {
        this.autoUpdater.checkForUpdates();
    }

    checkForUpdatesAndNotify() {
        this.autoUpdater.checkForUpdatesAndNotify();
    }
}
```

---

## 七、安全性

### 7.1 安全最佳实践

```javascript
// main.js - 安全配置

// 1. 禁用远程模块
webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    webSecurity: true,
    allowRunningInsecureContent: false
}

// 2. 设置 CSP
mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
        responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [
                "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
            ]
        }
    });
});

// 3. 验证 URL
function isValidUrl(url) {
    const allowedProtocols = ['https:'];
    try {
        const parsed = new URL(url);
        return allowedProtocols.includes(parsed.protocol);
    } catch {
        return false;
    }
}

// 4. 安全地打开外部链接
function openExternalUrl(url) {
    if (isValidUrl(url)) {
        require('electron').shell.openExternal(url);
    }
}

// 5. 禁用导航
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        event.preventDefault();
        console.log('导航被阻止:', navigationUrl);
    });

    contents.setWindowOpenHandler(({ url }) => {
        openExternalUrl(url);
        return { action: 'deny' };
    });
});
```

### 7.2 常见安全漏洞防护

```javascript
// 1. 防止 XSS
// 渲染进程中不要使用 eval、new Function 等
// 使用 textContent 而不是 innerHTML

// 2. 防止命令注入
// 永远不要将用户输入传递给 shell 命令
const userInput = "test; rm -rf /";
// 错误
require("child_process").exec(`ls ${userInput}`);
// 正确
require("child_process").execFile("ls", [userInput]);

// 3. 验证 IPC 消息来源
ipcMain.on("open-file", (event) => {
    // 验证来源
    if (event.senderFrame.origin !== "https://trusted-site.com") {
        console.error("未授权的访问");
        return;
    }
    // 处理请求
});

// 4. 安全存储敏感数据
const { safeStorage } = require("electron");

// 加密
if (safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString("my-secret-data");
    // 存储 encrypted
}

// 解密
const decrypted = safeStorage.decryptString(encrypted);
```

---

## 八、调试与性能

### 8.1 调试方法

```javascript
// main.js - 开启完整日志
const fs = require("fs");
const path = require("path");

const logStream = fs.createWriteStream(path.join(app.getPath("userData"), "app.log"), { flags: "a" });

console.log = (...args) => {
    const message = `[${new Date().toISOString()}] ${args.join(" ")}\n`;
    logStream.write(message);
    process.stdout.write(message);
};

console.error = (...args) => {
    const message = `[${new Date().toISOString()}] ERROR: ${args.join(" ")}\n`;
    logStream.write(message);
    process.stderr.write(message);
};
```

```javascript
// 渲染进程 DevTools
// 在渲染进程中打开 DevTools
mainWindow.webContents.openDevTools();

// 远程调试
// 启动时添加 --remote-debugging-port=9222
// 然后访问 http://localhost:9222
```

### 8.2 性能优化

```javascript
// 1. 减少 GPU 使用
app.disableHardwareAcceleration();

// 2. 启用懒加载
// 对于大型应用，使用 BrowserView 或 WebContents 延迟加载

// 3. 优化内存使用
// - 及时释放不需要的资源
// - 使用弱引用
// - 避免内存泄漏

// 4. 监控性能
mainWindow.webContents.on("did-finish-load", () => {
    console.log("页面加载时间:", Date.now() - startTime);
});

mainWindow.webContents.on("responsive", () => {
    console.log("窗口响应");
});

// 5. 使用 WebWorker
// 渲染进程中处理复杂计算
const worker = new Worker("worker.js");
worker.postMessage({ type: "process", data: bigData });
worker.onmessage = (event) => {
    console.log("处理结果:", event.data);
};
```

---

## 九、面试题

### 9.1 面试题1：Electron 的架构是怎样的？

**参考答案：**

Electron 基于 Chromium 和 Node.js 构建，主要包含三个核心概念：

**1. 主进程（Main Process）**

- 整个应用只有一个主进程
- 运行在 Node.js 环境中
- 负责创建和管理 BrowserWindow
- 可以访问系统原生 API
- 管理应用生命周期

**2. 渲染进程（Renderer Process）**

- 每个窗口对应一个渲染进程
- 运行在 Chromium 环境中
- 负责页面渲染和交互
- 默认无法直接访问 Node.js API
- 通过 IPC 与主进程通信

**3. 预加载脚本（Preload）**

- 在渲染进程创建前加载
- 运行在 Node.js 和 DOM 之间
- 通过 contextBridge 安全暴露 API
- 实现进程间安全通信

**通信方式：**

- `ipcRenderer.send` / `ipcMain.on`：单向通信
- `ipcRenderer.invoke` / `ipcMain.handle`：双向通信（带返回值）
- `webContents.send`：主进程主动发送

### 9.2 面试题2：Electron 的安全性如何保证？

**参考答案：**

**安全配置：**

```javascript
// 推荐的安全配置
webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    webSecurity: true,
    allowRunningInsecureContent: false
}
```

**具体措施：**

1. **启用 Context Isolation**
    - 渲染进程和预加载脚本隔离
    - 防止 prototype 污染攻击

2. **禁用 Node Integration**
    - 渲染进程无法直接访问 Node.js
    - 必须通过 preload 暴露的 API

3. **使用 contextBridge**

    ```javascript
    // preload.js
    contextBridge.exposeInMainWorld("electronAPI", {
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    });
    ```

4. **内容安全策略 (CSP)**

    ```http
    Content-Security-Policy: default-src 'self'; script-src 'self'
    ```

5. **验证 IPC 来源**

    ```javascript
    ipcMain.on("message", (event) => {
        if (event.senderFrame.origin !== "https://trusted.com") {
            return;
        }
    });
    ```

6. **安全存储**
    ```javascript
    const { safeStorage } = require("electron");
    const encrypted = safeStorage.encryptString("secret");
    ```

### 9.3 面试题3：Electron 与 NW.js 的区别？

**参考答案：**

| 特性      | Electron           | NW.js                   |
| --------- | ------------------ | ----------------------- |
| 架构      | Chromium + Node.js | Chromium + Node.js      |
| 入口      | JavaScript main    | JavaScript main 或 HTML |
| 打包体积  | 较大               | 较小                    |
| 社区      | 活跃               | 一般                    |
| 维护      | GitHub (Atom团队)  | nwjs-contrib            |
| 自动更新  | electron-updater   | 第三方                  |
| Node 嵌入 | 独立 Node          | 共享 Node               |
| 性能      | 相当               | 相当                    |
| 文档      | 完善               | 一般                    |

**Electron 优势：**

- 更活跃的社区
- 更完善的文档和工具链
- 更多的知名应用案例（VS Code, Slack等）
- 更好的自动更新支持

**NW.js 优势：**

- 可以直接用 HTML 作为入口
- 打包体积更小
- 支持直接调用 Node.js API（在网页中）

### 9.4 面试题4：Electron 应用如何打包优化？

**参考答案：**

**1. 使用 electron-builder**

```json
{
    "build": {
        "appId": "com.app.id",
        "productName": "MyApp",
        "compression": "maximum",
        "asar": true,
        "files": ["dist/**/*", "package.json"],
        "extraResources": [
            {
                "from": "resources/",
                "to": "resources/",
                "filter": ["**/*"]
            }
        ]
    }
}
```

**2. 优化打包体积**

- 使用 `electron-builder` 的 `compression: 'maximum'`
- 设置 `asar: true` 压缩打包文件
- 只包含必要的文件，排除 `node_modules` 中不需要的包
- 使用 UPX 压缩可执行文件

**3. 代码优化**

```javascript
// 使用代码分割
// 延迟加载不需要的模块
const heavyModule = await import("./heavyModule.js");

// 清理内存
// 窗口关闭时清理资源
window.on("closed", () => {
    window = null;
    if (interval) clearInterval(interval);
});
```

**4. 分发优化**

- 使用增量更新
- 设置正确的 `publish` 配置
- 使用私钥签名（macOS）

### 9.5 面试题5：Electron 的性能优化策略？

**参考答案：**

**1. 渲染进程优化**

```javascript
// 减少重绘和重排
// 使用 CSS transform 代替位置变化
element.style.transform = `translateX(${x}px)`;

// 使用 will-change 提示浏览器优化
element.style.willChange = "transform";

// 虚拟列表（大量数据）
// 使用 react-virtualized 或 vue-virtual-scroller
```

**2. 内存优化**

```javascript
// 避免内存泄漏
// 及时清理事件监听
componentWillUnmount() {
    ipcRenderer.removeAllListeners('update');
}

// 使用 WeakMap / WeakSet
const cache = new WeakMap();

// 大数据处理使用 WebWorker
const worker = new Worker('process.js');
worker.postMessage(largeData);
```

**3. 网络优化**

```javascript
// 启用 HTTP 缓存
session.defaultSession.cache.enabled = true;

// 使用 GZIP
// 服务器端启用 gzip 压缩

// 合并请求
// API 请求合并
```

**4. GPU 优化**

```javascript
// 禁用硬件加速（如果不需要）
app.disableHardwareAcceleration();

// 减少合成层
// 避免过多 CSS 动画
// 使用 CSS containment
```

**5. 应用启动优化**

```javascript
// 延迟加载非必要模块
// 使用动态 import
async function loadFeatures() {
    if (userPreferences.enableDarkMode) {
        const { darkMode } = await import("./darkMode.js");
        darkMode.init();
    }
}
```

**6. IPC 优化**

```javascript
// 使用批量操作
// 避免频繁的 IPC 调用
// 使用 invoke 而不是多次 send
```
