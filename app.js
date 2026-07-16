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
const User = require('./models/user')
const passport = require('passport')
const localStrategy = require('passport-local')

const session = require('express-session')
const flash = require('connect-flash')

const Campgroundroutes = require('./routes/campground')
const Reviewroutes = require('./routes/review')

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

app.use(express.static(path.join(__dirname, 'public')))



const sessionConfig = {
    secret: 'Thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httponly: true
    }
}

app.use(session(sessionConfig))

app.use(flash())
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/campgrounds', Campgroundroutes)
app.use('/campgrounds/:id/reviews', Reviewroutes)

app.get('/fakeuser', async (req, res) => {
    const user = new User({ email: 'bvgsasi2024@gmail.com', username: 'bvg' })
    const newuser = await User.register(user, 'chicken')
    res.send(newuser)
})

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