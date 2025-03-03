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
    
    // tell the client that the resource wasn't found
    response.statusCode = 404
    response.setHeader('Content-Type', 'application/json')
    response.setHeader('X-Powered-By', 'bacon')

    response.writeHead(200, {
        'content-type': 'application/json',
        'X-Powered-By':'bacon'  // this is an example of self-defined header
    })

    response.write('<html>')
    response.write('<body>')
    response.write('<h1>Hello World 🥳</h1>')
    response.write('</body>')
    response.write('</html>')
    response.end()

    response.end('<html><body><h1>Hello, World!</h1></body></html>');

}).listen(8080)



server.on('request', (request, response) => {
    // the request object is an instance of 'IncomingMessage'
})