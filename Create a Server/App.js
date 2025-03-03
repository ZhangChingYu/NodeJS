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