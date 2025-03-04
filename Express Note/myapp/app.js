const express = require('express')
const app = express()
const port = 3000

/** GET */

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get(/a/, (req, res) => {
    res.send(req.url)
})

app.get(/.*fly$/, (req, res) => {
    res.send(req.url)
})

app.get('/users/:userId/books/:bookId', (req, res) => {
    res.send(JSON.stringify(req.params))
})

app.get('/flights/:from-:to', (req, res) => {
    res.send(JSON.stringify(req.params))
})

app.get('/user/:userId(\\d+)', (req, res) => {
    res.send(req.params.userId)
})

/** POST */

app.post('/', (req, res) => {
    res.send('Got a POST request')
})

/** PUT */

app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user')
})

/** DELETE */

app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user')
})

/** ALL */

app.all('/secret', (req, res, next) => {
    console.log('Accessing the secret section...')
    next() // pass control to the next handler
})

/** RUN */

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})