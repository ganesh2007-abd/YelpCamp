const express = require('express')
const router = express.Router({ mergeParams: true })
const expressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { reviewSchema } = require('../schemas')

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

router.post('/', validatereview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const rev = new Review(req.body.review)
    campground.review.push(rev);
    await campground.save()
    await rev.save()
    req.flash('success', 'successfully added review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewid', catchAsync(async (req, res) => {
    const { id, reviewid } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewid } })
    await Review.findByIdAndDelete(reviewid)
    req.flash('success', 'successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
    // res.send('delete me bruhh')
}))

module.exports = router;