const express = require('express')
const ejs = require('ejs')
const path = require('path')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', ejs)

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.listen(3000, () => {
    console.log("Listening on 3000...")
})