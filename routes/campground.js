const express = require('express')
const router = express.Router()
const expressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')

const { isLoggedin, isAuthor, validatecampground } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')


// router.get('/', (req, res) => {
//     res.render('home.ejs')
// })

// router.get('/makecampground', validatecampground, catchAsync(async (req, res) => {
//     const Camp = new Campground({ title: "My backyard", price: "26", description: "very cheap" })
//     await Camp.save()
//     res.send(Camp)
// }))

router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedin, campgrounds.renderNewForm)

router.get('/:id', catchAsync(campgrounds.showCampground))


router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campgrounds.renderEditForm))


router.post('/', isLoggedin, validatecampground, catchAsync(campgrounds.createCampground))


router.put('/:id', isLoggedin, isAuthor, validatecampground, catchAsync(campgrounds.editCampground))

router.delete('/:id', isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router