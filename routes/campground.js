const express = require('express')
const router = express.Router()
const expressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')


const validatecampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else {
        next()
    }
}


// router.get('/', (req, res) => {
//     res.render('home.ejs')
// })

// router.get('/makecampground', validatecampground, catchAsync(async (req, res) => {
//     const Camp = new Campground({ title: "My backyard", price: "26", description: "very cheap" })
//     await Camp.save()
//     res.send(Camp)
// }))

router.get('/', validatecampground, catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new.ejs')
})

router.get('/:id', validatecampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('review')
    res.render('campgrounds/show.ejs', { campground })
}))


router.get('/:id/edit', validatecampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit.ejs', { campground })
}))


router.post('/', validatecampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.put('/:id', validatecampground, catchAsync(async (req, res) => {
    // console.log('Entered put request')
    const { id } = req.params
    // console.log(id)
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    // console.log(campground)
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

module.exports = router