const express = require('express')
const router = express.Router({ mergeParams: true })

// middleware that is specific to this router
const timeLog = (req, res, next) => {
    console.log('Time: ', Date.now())
    next()
}

router.use(timeLog)

// define the home page route
router.get('/', (req, res) => {
    res.send('Birds home page')
})

// define the about route
router.get('/about', (req, res) => {
    res.send('About birds')
})

router.get('/:id', (req, res) => {
    res.send(req.params.id)
})

module.exports = router