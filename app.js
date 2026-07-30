if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

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
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const { MongoStore } = require('connect-mongo');


// const dbUrl = process.env.DB_URL
const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp-maptiler'

const session = require('express-session')
const flash = require('connect-flash')

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const Campgroundroutes = require('./routes/campground')
const Reviewroutes = require('./routes/review')
const registerroutes = require('./routes/users')


mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp-maptiler')
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

app.use(helmet({
    contentSecurityPolicy: false
}))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.SECRET || "thisshouldbeabettersecret";


const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(flash())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/sgzwlhoq/",
                "https://images.unsplash.com/",
                "https://api.maptiler.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use((req, res, next) => {
    // console.log(req.query)
    res.locals.currUser = req.user
    // console.log(req.user)
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', Campgroundroutes)
app.use('/campgrounds/:id/reviews', Reviewroutes)
app.use('/', registerroutes)

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

app.get('/', (req, res) => {
    res.render('users/home.ejs')
})

app.listen(3000, () => {
    console.log("Listening on 3000...")
})