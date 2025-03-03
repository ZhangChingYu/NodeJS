const http = require('node:http')

// we use createServer() to create a web server object.
const server = http.createServer((request, response) => {
    const { headers, method, url } = request
    // const userAgent = headers['user-agent']
    if(method === 'GET') {
        console.log('GET')
    }
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
            /* BEGINNING OF NEW STUFF */

            response.statusCode = 200
            response.setHeader('content-type', 'application/json')
            // Note: the 2 lines above could be replaced with this next noe:
            // response.writeHead(200, {'content-type', 'application/json})

            const responseBody = { headers, method, url, body }
            response.write(JSON.stringify(responseBody))
            response.end()
            // Note: the 2 lines above can be replaced with this next one:
            // response.end(JSON.stringify(responseBody))
            
            /* END OF NEW STUFF */
        })
}).listen(8080)