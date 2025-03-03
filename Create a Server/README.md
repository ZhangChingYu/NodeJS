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
