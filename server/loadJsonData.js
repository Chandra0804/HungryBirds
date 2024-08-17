const fs = require("fs");
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurants");

const mongoURL = 'mongodb+srv://chandrasaiteja0804:Chandra0804@cluster0.d2qbw.mongodb.net/'
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// const file = JSON.parse(fs.readFileSync("./data/file1.json"));
// const file = JSON.parse(fs.readFileSync("./data/file2.json"));
// const file = JSON.parse(fs.readFileSync("./data/file3.json"));
// const file = JSON.parse(fs.readFileSync("./data/file4.json"));
const file = JSON.parse(fs.readFileSync("./data/file5.json"));

// Merge the objects
const mergedObject = { ...file };
for (const key in mergedObject) {
    if (mergedObject[key].message === "API limit exceeded") {
        delete mergedObject[key];
    }
}
let restaurantNames = [];

for (const key in mergedObject) {
    if (mergedObject[key].restaurants) {
        const names = mergedObject[key].restaurants.map((r) => r.restaurant);
        restaurantNames = restaurantNames.concat(names);
    }
}
console.log(restaurantNames.length);
const insertRestaurants = async () => {
    try {
        const result = await Restaurant.insertMany(restaurantNames);
        console.log('Restaurants inserted:', result);
    } catch (err) {
        console.error('Error inserting restaurants:', err);
    }
};
// insertRestaurants();

const countryMapping = {
    1: 'India',
    14: 'Australia',
    30: 'Brazil',
    37: 'Canada',
    94: 'Indonesia',
    148: 'New Zealand',
    162: 'Phillipines',
    166: 'Qatar',
    184: 'Singapore',
    189: 'South Africa',
    191: 'Sri Lanka',
    208: 'Turkey',
    214: 'UAE',
    215: 'United Kingdom',
    216: 'United States'
};
const updateCountryNames = (restaurants) => {
    return restaurants.map(restaurant => {
        if (restaurant.location && countryMapping[restaurant.location.country_id]) {
            restaurant.location.country = countryMapping[restaurant.location.country_id];
        }
        return restaurant;
    });
};
const updatedRestaurants = updateCountryNames(restaurantNames);
console.log(updatedRestaurants);

try {
    const result = Restaurant.insertMany(updatedRestaurants);
    console.log("Restaurants inserted:", result);
} catch (err) {
    console.error("Error inserting restaurants:", err);
}
module.exports = mergedObject;