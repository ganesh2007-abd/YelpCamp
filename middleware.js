const campground = require("./models/campground")
const { campgroundSchema } = require('./schemas')
const { reviewSchema } = require('./schemas')
const Review = require('./models/review')
const expressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')

module.exports.storereturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
}

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        // console.log(req.path,req.originalUrl)
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const cmp = await campground.findById(id)
    if (!cmp.author.equals(req.user._id)) {
        req.flash('error', 'You have No permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.reviewAuthor = async (req, res, next) => {
    const { id, reviewid } = req.params
    const rev = await Review.findById(reviewid)
    if (!rev.author.equals(req.user._id)) {
        req.flash('error', 'You have No permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validatecampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else {
        next()
    }
}

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else {
        next()
    }
}