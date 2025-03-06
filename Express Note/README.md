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
## Route Handler
你可以為一個請求提供多個回調函數，這些回呼函數的行為類似於中間件。唯一的例外是，這些回呼函數可以呼叫 next('route') 來跳過目前路由中剩餘的回呼函數。你可以利用這個機制為路由設定一些前置條件，如果目前路由沒有繼續執行的必要，就可以將控制權交給後續的路由。
路由處理程序（Route Handlers）可以是以下形式：
- 單一函數
```javascript
app.get('/user/:userId(\\d+)', (req, res) => {
    res.send(req.params.userId)
})
```
- 多個回調函數
```javascript
app.get('/test', (req, res, next) => {
    console.log('the response will be sent by the next function... ')
    next()
}, (req, res) => {
    res.send('From next function.')
})
```
- 一個函數數組
```javascript
const cb1 = function (req, res, next) {
    console.log('CB1')
    next()
}

const cb2 = function (req, res, next) {
    console.log('CB2')
    next()
}

const cb3 = function (req, res) {
    res.send('This is 3')
}

app.get('/test/c', [cb1, cb2, cb3])
```
- 上述兩種形式的組合
```javascript
app.get('/test/d', [cb1, cb2], (req, res, next) => {
    console.log('the response will be sent by the next function...')
    next()
}, (req, res) => {
    res.send('This is 4')
})
```

### 詳細點說：
1. 多個回調函數：你可以為一個路由定義多個回呼函數，它們會依序執行。這些回呼函數的行為類似於中間件，可以對請求進行處理。
2. next('route')：如果某個回呼函數呼叫了 next('route')，則會跳過目前路由中剩餘的回呼函數，直接進入下一個符合的路由。這種機制可以用來實現一些前置條件檢查。如果檢查不通過，就直接跳過目前路由。
3. 路由處理程序的形式： 路由處理程序可以是單一函數，也可以是函數數組，甚至是它們的組合。

## Response Methods
在 Express（或其他類似的 Web 框架）中，res（response 物件）的方法（例如 res.send()、res.json()、res.end()）可以向客戶端發送響應並結束請求-響應循環。

如果在路由處理函數（route handler）中沒有調用這些方法，請求將會一直處於等待狀態，不會收到任何響應，導致客戶端一直掛起（hanging）。

### ✅正確的做法
這樣，客戶端請求 /hello 時，會收到 "Hello, World!"，請求順利結束。
```javascript
app.get('/hello', (req, res) => {
    res.send('Hello, World!'); // 這裡發送了響應，請求-響應循環結束
});
```
### ❌錯誤的做法
這樣，客戶端會一直等不到伺服器的回應，因為 res.send() 或 res.end() 沒有被調用，請求一直在等待，沒有結束。
```javascript
app.get('/hello', (req, res) => {
    console.log('Received a request'); // 只打印日誌，沒有調用 res.send() 或其他響應方法
});
```
### 常見的 **res** 方法
| 方法 | 作用 |
| --- | --- |
|res.send(data)|發送字符串、JSON 或 Buffer 作為響應|
|res.json(obj)|發送 JSON 格式的響應|
|res.end()|結束響應（不發送內容）|
|res.redirect(url)|重定向客戶端到指定 URL|
|res.status(code).send(data)|設置 HTTP 狀態碼並發送響應|
|res.render(view, data)|渲染視圖並發送 HTML|
|res.download(path [, filename] [, callback])|讓客戶端下載文件|
|res.jsonp()|發送 JSONP（JSON with Padding） 格式的數據，用於跨域請求|
|res.sendFile()|向客戶端發送文件（但不像 res.download() 那樣會觸發下載，這裡只是直接顯示）|
|res.sendStatus()|發送一個 HTTP 狀態碼，並自動設置對應的狀態消息|
