const mongoose = require('mongoose')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedhelpers')
const cities = require('./cities')

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(dbUrl);

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database Connected")
})

// mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
//     .then(() => {
//         console.log("Mongodb Connection Open!")
//     })
//     .catch((err) => {
//         console.log("MongoDB connection error")
//         console.log(err)
//     })

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({

            author: '',

            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,

            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },

            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})