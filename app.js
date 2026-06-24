const express = require('express')
const ejs = require('ejs')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Mongodb Connection Open!")
    })
    .catch((err) => {
        console.log("MongoDB connection error")
        console.log(err)
    })


const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', ejs)

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/makecampground', async (req, res) => {
    const Camp = new Campground({ title: "My backyard", price: "26", description: "very cheap" })
    await Camp.save()
    res.send(Camp)
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
})

app.listen(3000, () => {
    console.log("Listening on 3000...")
})