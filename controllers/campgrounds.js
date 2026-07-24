const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs')
}

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground)
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save()
    // console.log(campground)
    req.flash('success', 'successfully added!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'cant find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit.ejs', { campground })
}

module.exports.editCampground = async (req, res) => {
    // console.log('Entered put request')
    const { id } = req.params
    // console.log(id)
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    campground.save()
    // console.log(campground)
    req.flash('success', 'successfully Updated!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'successfully deleted!')
    res.redirect('/campgrounds')
}