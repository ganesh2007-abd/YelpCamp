const mongoose = require('mongoose')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedhelpers')
const cities = require('./cities')

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Mongodb Connection Open!")
    })
    .catch((err) => {
        console.log("MongoDB connection error")
        console.log(err)
    })

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 4000) + 200
        const camp = new Campground({
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: `https://picsum.photos/400?random=${Math.random()}`,
            description: "Very good place",
            author: '6a5ddb863c419404902eb17d',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/sgzwlhoq/image/upload/v1784886576/YelpCamp/lb3kpxbdqxkqprfaofqx.png',
                    filename: 'YelpCamp/lb3kpxbdqxkqprfaofqx',

                },
                {
                    url: 'https://res.cloudinary.com/sgzwlhoq/image/upload/v1784886575/YelpCamp/xybxta9zxq6orn7eznpo.png',
                    filename: 'YelpCamp/xybxta9zxq6orn7eznpo',

                }
            ]
        })
        await camp.save()
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})