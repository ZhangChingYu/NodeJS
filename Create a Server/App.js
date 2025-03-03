const http = require('node:http')

// we use createServer() to create a web server object.
const server = http.createServer((request, response) => {
    // magic happens here!
})



server.on('request', (request, response) => {
    // the request object is an instance of 'IncomingMessage'
    const { method, url } = request
    const { headers } = request
    const userAgent = headers['user-agent']

    let body = []
    request.on('data', chunk => {
        body.push(chunk)
    })
    .on('end', () => {
        body = Buffer.concat(body).toString()
        // at this point, 'body' has the entire request body
    })
})