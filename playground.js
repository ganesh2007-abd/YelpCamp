if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const maptiler = require('@maptiler/client')
maptiler.config.apiKey = process.env.MAPTILER_API_KEY

async function findGeocoordinates() {
    const result = await maptiler.geocoding.forward("Tanuku", {});

    // const coordinates = result.features[0].geometry.coordinates;

    console.log(result.features[0]);
}

findGeocoordinates()