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

## 基礎 Routing
在 Web 開發 中，Routing（路由） 指的是決定應用如何響應來自客戶端的請求，通常根據 URL（路徑） 和 HTTP 方法（如 GET、POST、PUT、DELETE） 來處理不同的請求。

### 路由的組成部分：
- 路徑（PATH）：請求的網址，如 /users 或 /products/123
- HTTP 方法 (METHOD)：GET（獲取資料）、POST（創建資料）、PUT（更新資料）、DELETE（刪除資料）
- 處理函數（HANDLER）：當請求符合條件時執行的函數
```javascript
app.METHOD(PATH, HANDLER)
``` 

### GET 請求
```javascript
app.get('/', (req, res) => {
    res.send('Hello World!')
})
```

### POST 請求
```javascript
app.post('/', (req, res) => {
    res.send('Got a POST request')
})
```

### PUT 請求
```javascript
app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user')
})
```

### DELETE 請求
```javascript
app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user')
})
```
### All 請求
有一個特殊的路由方法 app.all()，可用於所有 HTTP 的請求方。無論使用 GET、POST、PUT、DELETE，或其他 http 模組中支援的任何請求方法，都會對路由的請求執行處理程序。
```javascript
app.all('/secret', (req, res, next) => {
    console.log('Accessing the secret section...')
    next() // pass control to the next handler
})
```
## 路徑 Patterns: 正則表達式(Regex)
- **?**: 代表前面的字符可有可無（0 次或 1 次）
    - ex. '/ab?cd' (✅/acd, ✅/abcd, ❌/abbcd)
    - ex. '/ab(cd)?e': ? 作用於()內的內容
- **+**: 前面的字符必須至少出現 1 次（1 次或多次）。
    - ex. '/ab+cd' (✅/abcd, ✅/abbcd, ✅abbbcd, ✅abbbbbbcd, ❌/acd)
- **$*$**: 前面的字符可以出現 0 次或多次，甚至可以被任何字符替代。
    - ex. '/ab*cd' (✅/abcd, ✅/abxcd, ✅/abJIESJcd, ✅/ab124cd, ❌/acd)
- /a/: 這條路由會匹配任何包含字母 a 的 URL，因為 /a/ 是一個正則表達式，表示「URL 中包含 a 即可匹配」。
    ex. /apple ✅（包含 a），/banana ✅（包含 a）
- /.*fly$/: 這條路由匹配任何以 fly 結尾的 URL：
    - .: 表示匹配任何字符（除了換行符）。
    - *: 表示前面的 . 可以出現 0 次或多次。
    - fly$: 表示以 fly 為結尾（$ 代表「結尾」）。

## Parameters 路由參數
路由參數是URL中的命名片段，用來擷取URL中特定位置的值。捕獲的值會被填入req.params物件中，而路由參數的名字會作為req.params物件的鍵。

假設你有一個路由路徑定義為 /users/:userId，其中 :userId 就是一個路由參數。

如果使用者存取的URL是 /users/123/books/4，那麼 123 會被捕獲，並儲存在 req.params.userId 中，4 會被捕獲，並存在 req.params.bookId。因此服務器返回的是 **{"userId":"123","bookId":"4"}**。
```javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
    res.send(JSON.stringify(req.params))
})
```
要注意，Parameter 的命名不能包含 '**.**' 或 '**-**'，我可以進一步利用這個特性：

此時，我們的請求 URL 可以是 '/flights/LAX-SFO'，req.param = {from: 'LAX', to:'SFO}，這不僅縮短了 URL 的長度，也讓可讀性提升了。
```javascript
app.get('/flights/:from-:to', (req, res) => {
    res.send(JSON.stringify(req.params))
})
```
如果想更精確的控制路徑參數的屬性，可以通過 regular expression 來實現，例如：
```javascript
// 此時/user/只能接收數字作為參數
app.get('/user/:userId(\\d+)', (req, res) => {
    res.send(req.params.userId)
})
```

