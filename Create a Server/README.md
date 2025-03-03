# 創建一個 Server
## 創建 server 對象
``` javascript
const http = require('node:http')
// we use createServer() to create a web server object.
const server = http.createServer((request, response) => {
    // magic happens here!
})
```
## createServer()
當你使用 Node.js 的 createServer 方法建立 HTTP 伺服器時，你傳入的那個函數會在每一次收到 HTTP 請求時被呼叫，所以稱它為「請求處理器」（request handler）。實際上，createServer 回傳的伺服器物件是一個 EventEmitter，這表示它可以監聽和觸發各種事件，例如「request」事件。

傳入的函數其實只是一種簡化寫法，相當於先建立一個伺服器物件，再為它添加一個「request」事件的監聽器，當伺服器收到請求時，就會執行這個監聽器裡面的程式碼。簡單來說，每當有 HTTP 請求進來時，這個請求處理器函數就會被執行，處理該請求。

```javascript
server.on('request', (request, response) => {
    // the same kind of magic happens here!
})
```

當一個 HTTP 請求抵達伺服器時，Node 會呼叫你所提供的請求處理器函式，並傳入幾個方便你處理整個交易、請求和回應的物件。
為了讓伺服器真正開始處理請求，你需要在伺服器物件上呼叫 listen 方法。大多數情況下，你只需要傳入你希望伺服器監聽的 port number。

- 請求處理器會在每次請求時被呼叫，並提供必要的工具讓你處理請求與回應。
- 你必須使用 listen 方法讓伺服器開始監聽指定的 port，才能真正對外提供服務。

# Method, URL, 和 Headers
當一個 HTTP 請求到達伺服器時，通常第一步是檢查請求物件上的 method 和 url 屬性，這樣就可以根據請求的類型（例如 GET、POST 等）和請求的路徑來決定要採取哪些操作。(Node.js 內建的 HTTP 請求物件是一個 IncomingMessage 的實例，這個物件已經封裝了處理請求所需的屬性和方法。)

請求的 header 會被儲存在一個名為 headers 的物件裡面，並且所有 header 的鍵都會被轉成小寫，這有助於在解析 header 時不需要考慮大小寫的差異。

如果某些 header 被重複送出，Node.js 會根據 header 的不同特性，把重複的值合併（通常以逗號分隔）或直接覆蓋，但有時這樣的合併方式可能會帶來問題，因此 Node.js 也提供了 rawHeaders 屬性，以便開發者能夠取得未經處理的原始 header 資料。

Node.js 在 HTTP 請求物件上提供一系列方便的屬性（例如 method、url、headers、rawHeaders），以便開發者能夠輕鬆地根據請求的不同資訊來做出相應的處理。

```javascript
server.on('request', (request, response) => {
    const { method, url } = request
    const { headers } = request
    const userAgent = headers['user-agent']
})
```

# Request Body
當我們的伺服器收到一個 POST 或 PUT 請求時，請求的主體（body）可能包含你應用程式需要的重要資料。不過，存取這些資料並不像讀取 header 那麼簡單，因為請求物件實作了 ReadableStream 介面。

你必須監聽這個 Stream 的 'data' 事件來逐步接收資料，每次收到的資料塊（chunk）都是一個 Buffer。如果你知道這些資料其實是字串，你可以把每個 Buffer 存到一個陣列裡，然後在 'end' 事件發生時，把這些 Buffer 串接起來並轉成字串。

雖然這個過程聽起來比較繁瑣，但其實這樣做可以讓你完全掌握資料是如何被接收和處理的。當然，市面上也有像 concat-stream 或 body-parser 這樣的 npm 模組，它們可以幫你封裝掉這些細節，讓你不用自己寫那麼多程式碼。不過，了解這些底層原理對於你未來的開發會很有幫助，這也是為什麼這裡要先解釋這個流程的原因。

```javascript

server.on('request', (request, response) => {
    let body = []
    request.on('data', chunk => {
        body.push(chunk)
    })
    .on('end', () => {
        body = Buffer.concat(body).toString()
        // at this point, 'body' has the entire request body
    })
})
```

## Errors
請求物件既是一個 ReadableStream，也是 EventEmitter，這意味著它可以像其他事件發射器一樣觸發事件，包括錯誤事件。

當請求流發生錯誤時，它會觸發 'error' 事件。如果你沒有為這個事件添加監聽器，那麼錯誤就會被拋出，進而可能導致整個 Node.js 程式崩潰。

因此，建議在使用請求流時，一定要添加一個 'error' 監聽器。即使你只是記錄錯誤並繼續運行，這樣也能防止程式因未處理的錯誤而崩潰。更好的做法是當發生錯誤時，能向客戶端返回一個合適的 HTTP 錯誤響應。

除了手動添加 'error' 監聽器之外，還有一些工具和抽象層（例如一些中間件、錯誤處理庫）可以幫助你自動處理這些錯誤。但無論如何，你都必須意識到錯誤是不可避免的，並且需要有適當的機制來處理它們。

```javascript
server.on('request', (request, response) => {
    let body = []
    request.on('error', err => {
        // this prints the error message and stack trace to 'stderr'
        console.error(err.stack)
    })
})
```
### 一個基本的 HTTP Server
這段代碼展示了一個基本的 Node.js HTTP 伺服器，它可以接收請求並解析其中的 標頭 (headers)、請求方法 (method)、URL 和請求主體 (body)，但它目前**沒有返回任何響應**，導致客戶端的請求會超時。

```javascript
const http = require('node:http')

// we use createServer() to create a web server object.
const server = http.createServer((request, response) => {
    const { headers, method, url } = request
    const userAgent = headers['user-agent']
    let body = []
    request
        .on('error', err => {
            // this prints the error message and stack trace to 'stderr'
            console.error(err)
        })
        .on('data', chunk => {
            body.push(chunk)
            // at this point, 'body' has the entire request body
        })
        .on('end', () => {
            body = Buffer.concat(body).toString()
        })
}).listen(8080)
```
在下一部分，我們會介紹 response 物件，它是一個 WritableStream，可以用來回應客戶端，並結束請求循環。

## HTTP Status Code
如果不特別設定的話，response 的 Status Code 會是200，在需要時，我們可以通過 setStatusCode 方法來指定
```javascript
// tell the client that the resource wasn't found
response.statusCode = 404
```

## Response Header
### 設置 Response Header
我們可以通過 setHeader 方法來方便的設置 Headers。在回應上設定標題時，名稱是不區分大小寫的。如果重複設定 Headers，則最後設定的值就是到時候發送出去的值。
```javascript
response.setHeader('Content-Type', 'application/json')
response.setHeader('X-Powered-By', 'bacon')
```
### 發送 Response Header 數據
在預設情況下，Node.js 會在你 第一次寫入回應主體 (body) 之前，自動發送標頭。這種方式稱為**隱式標頭 (implicit headers)**。例如：

```javascript
response.statusCode = 200;  // 設定狀態碼
response.setHeader('Content-Type', 'application/json'); // 設定標頭
response.end(JSON.stringify({ message: 'Hello, world!' })); // 發送回
// 應
```

這裡**沒有明確指示**何時發送標頭，Node.js 會在 response.end() 之前自動發送。
如果你想要**手動**控制標頭的發送時機，可以使用 writeHead：

```javascript
response.writeHead(200, {
  'Content-Type': 'application/json',
  'X-Powered-By': 'bacon',
});
```

writeHead 會**立即發送標頭**，這樣後續的 response.write() 和 response.end() 只會影響回應主體 (body)，不會再影響標頭。

如果你用 writeHead()，就不需要再用 setHeader()，因為 writeHead() 會一次性設置所有標頭。
#### 小結
- 隱式標頭：讓 Node.js 自動在發送回應主體前設置標頭 (setHeader() + statusCode)。
- 顯式標頭：使用 writeHead(statusCode, headers) 來明確發送標頭。
- writeHead() 會立即發送標頭，所以之後不能再用 setHeader() 修改。

## 發送 Response Body 數據
在 Node.js 中，response 物件是一個 可寫流 (WritableStream)，所以可以使用**Stream 的方法**來寫入數據，例如：
```javascript
response.write('<html>')
// or
response.end('<html><body><h1>Hello, World!</h1></body></html>');
```
end() 方法有兩個作用，一個是關閉回應流 (stream)，表示回應結束，另一個是發送最後一部分數據（可選）。

如果你想分多次寫入數據，可以使用 write() 來逐步發送，然後用 end() 結束。

⚠️需要注意的是，標頭 (headers) 必須在開始寫入數據前設置，因為 HTTP 協議的標頭部分在主體之前。

❌錯誤示範：
```javascript
response.write('Hello, world!');
response.writeHead(200, { 'Content-Type': 'text/plain' });

```