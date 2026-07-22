const express = require('express')
const router = express.Router({ mergeParams: true })
const expressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { reviewSchema } = require('../schemas')
const { validatereview, isLoggedin, reviewAuthor } = require('../middleware')

const reviews = require('../controllers/reviews')


router.post('/', isLoggedin, validatereview, catchAsync(reviews.createReview))

router.delete('/:reviewid', isLoggedin, reviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;