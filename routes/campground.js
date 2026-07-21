const express = require('express')
const router = express.Router()
const expressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')

const { isLoggedin, isAuthor, validatecampground } = require('../middleware')


// router.get('/', (req, res) => {
//     res.render('home.ejs')
// })

// router.get('/makecampground', validatecampground, catchAsync(async (req, res) => {
//     const Camp = new Campground({ title: "My backyard", price: "26", description: "very cheap" })
//     await Camp.save()
//     res.send(Camp)
// }))

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
}))

router.get('/new', isLoggedin, (req, res) => {
    res.render('campgrounds/new.ejs')
})

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'review',
        populate: {
            path: 'author'
        }
    }).populate('author')
    // console.log(campground)
    if (!campground) {
        req.flash('error', 'cant find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs', { campground })
}))


router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'cant find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit.ejs', { campground })
}))


router.post('/', isLoggedin, validatecampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'successfully added!')
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.put('/:id', isLoggedin, isAuthor, validatecampground, catchAsync(async (req, res) => {
    // console.log('Entered put request')
    const { id } = req.params
    // console.log(id)
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    // console.log(campground)
    req.flash('success', 'successfully Updated!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedin, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'successfully deleted!')
    res.redirect('/campgrounds')
}))

module.exports = router