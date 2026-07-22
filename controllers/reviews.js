const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const rev = new Review(req.body.review)
    rev.author = req.user._id
    campground.review.push(rev);
    await campground.save()
    await rev.save()
    req.flash('success', 'successfully added review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewid } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewid } })
    await Review.findByIdAndDelete(reviewid)
    req.flash('success', 'successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
    // res.send('delete me bruhh')
}