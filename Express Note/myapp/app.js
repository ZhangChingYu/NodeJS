const express = require('express')
const app = express()
const port = 3000

/** GET */

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get(/z/, (req, res) => {
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

app.get('/test', (req, res, next) => {
    console.log('the response will be sent by the next function... ')
    next()
}, (req, res) => {
    res.send('From next function.')
})

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

app.get('/test/d', [cb1, cb2], (req, res, next) => {
    console.log('the response will be sent by the next function...')
    next()
}, (req, res) => {
    res.send('This is 4')
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

/** APP ROUTE */

app.route('/book')
    .get((req, res) => {
        res.send('Get a random book')
    })
    .post((req, res) => {
        res.send('Add a book')
    })
    .put((req, res) => {
        res.send('Update the book')
    })

/** EXPRESS ROUTER */
const birds = require('./birds')
app.use('/birds', birds)

/** RUN */

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})