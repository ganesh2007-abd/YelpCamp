const express = require('express')
const ejs = require('ejs')
const path = require('path')
const ejsmate = require('ejs-mate')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const expressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')

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

app.engine('ejs', ejsmate)


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/makecampground', catchAsync(async (req, res) => {
    const Camp = new Campground({ title: "My backyard", price: "26", description: "very cheap" })
    await Camp.save()
    res.send(Camp)
}))

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs')
})

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show.ejs', { campground })
}))


app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit.ejs', { campground })
}))


app.post('/campgrounds', catchAsync(async (req, res) => {
    if (!req.body.campground) throw new expressError('campground not found', 500)
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)

}))


app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    // console.log('Entered put request')
    const { id } = req.params
    // console.log(id)
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    // console.log(campground)
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.all('/*splats', (req, res, next) => {
    res.status(404).send('Page not found')
})

app.use((err, req, res, next) => {
    res.send("Something went wrong")
})

app.listen(3000, () => {
    console.log("Listening on 3000...")
})