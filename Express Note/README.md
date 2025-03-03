# Express 

## Express 安裝
在安裝 Express.js 之前，請確保你的電腦已經安裝了 Node.js。
- Express 4.x 需要 Node.js 0.10 以上的版本
- Express 5.x 需要 Node.js 18 以上的版本
在控制台輸入以下命令可以查看當前使用的 Node 版本
```cmd
node -v
```
### 1. 項目初始化
```cmd
mkdir myapp
cd myapp
```
### 2. 創建 package.json 檔案
```cmd
npm init
```
輸入完命令後會提示輸入一些訊息，例如應用程式的名稱和版本。我們只需要按 RETURN 即可接受大多數選項的預設設置，但以下情況除外：
```cmd
entry point: (index.js)
```
輸入 app.js，或你想要的主檔案的名稱。如果你希望它是 index.js，繼續按 RETURN 接受建議的預設檔名就可以了。
### 3. 下載 Express
我們將 Express 安裝進 /myapp 目錄並保存依賴列表：
```cmd
npm install express
```
- 如果你只想要暫時安裝 Express 不想將其添加進依賴列表，可以輸入：
```cmd
npm install express --no-save
```
## Hello World
剛剛我們初始化了 Express.js 項目的框架，現在我們可以開始實現一個簡單的 Hello World 服務器。

首先，在 /myapp 目錄新建一個 app.js 文件(如果當初設置的 entry point 是別的名字就創建相應的 .js 文件)，並輸入以下代碼：
```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
```
運行後 Server 會監聽連接 port 3000 上的連線。應用程式對於Root URL (/) 或路由的請求回應 “Hello World!” 。對於其他每個路徑，以 404 Not Found 回應。

### 運行 app
要運行這個 Server，需要在 /myapp 的控制台中輸入以下命令：
```cmd
npm app.js
```
運行成功控制台會輸出 “Example app listening on port 3000”，然後我們通過 http://locolhost:3000/ 向 Server 發送請求，在頁面上就能看到 Hello World! 

### Express Generator
如果我們使用 Express Generator 來初始化 Express 項目，那目錄會是這樣的：
```cmd
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug
```