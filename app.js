const express = require('express')
const ejs = require('ejs')
const path = require('path')
const ejsmate = require('ejs-mate')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const expressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')
const Joi = require('joi')
const { campgroundSchema, reviewSchema } = require('./schemas')
const Review = require('./models/review')


const Campgroundroutes = require('./routes/campground')


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


app.use('/campgrounds', Campgroundroutes)



const validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else {
        next()
    }
}




//Reviews

app.post('/campgrounds/:id/review', validatereview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const rev = new Review(req.body.review)
    campground.review.push(rev);
    await campground.save()
    await rev.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewid', catchAsync(async (req, res) => {
    const { id, reviewid } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewid } })
    await Review.findByIdAndDelete(reviewid)
    res.redirect(`/campgrounds/${id}`)
    // res.send('delete me bruhh')
}))


app.all('/*splats', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) {
        err.message = 'something wrong!'
    }
    res.status(status).render('error', { err })
})

app.listen(3000, () => {
    console.log("Listening on 3000...")
})