const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');

mongoose.connect('mongodb+srv://chandrasaiteja0804:Chandra0804@cluster0.d2qbw.mongodb.net/');

const restaurantSchema = new mongoose.Schema({
  restaurantID: String,
  restaurantName: String,
  countryCode: String,
  city: String,
  address: String,
  locality: String,
  localityVerbose: String,
  longitude: Number,
  latitude: Number,
  cuisines: String,
  averageCostForTwo: Number,
  currency: String,
  hasTableBooking: String,
  hasOnlineDelivery: String,
  isDeliveringNow: String,
  switchToOrderMenu: String,
  priceRange: Number,
  aggregateRating: Number,
  ratingColor: String,
  ratingText: String,
  votes: Number
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

fs.createReadStream('/Users/saiteja/project/TypeFace/server/data/zomato.csv')
  .pipe(csv())
  .on('data', (row) => {
    const restaurant = new Restaurant({
      restaurantID: row['Restaurant ID'],
      restaurantName: row['Restaurant Name'],
      countryCode: row['Country Code'],
      city: row['City'],
      address: row['Address'],
      locality: row['Locality'],
      localityVerbose: row['Locality Verbose'],
      longitude: parseFloat(row['Longitude']),
      latitude: parseFloat(row['Latitude']),
      cuisines: row['Cuisines'],
      averageCostForTwo: parseFloat(row['Average Cost for two']),
      currency: row['Currency'],
      hasTableBooking: row['Has Table booking'],
      hasOnlineDelivery: row['Has Online delivery'],
      isDeliveringNow: row['Is delivering now'],
      switchToOrderMenu: row['Switch to order menu'],
      priceRange: parseInt(row['Price range']),
      aggregateRating: parseFloat(row['Aggregate rating']),
      ratingColor: row['Rating color'],
      ratingText: row['Rating text'],
      votes: parseInt(row['Votes'])
    });

    restaurant.save()
      .then(() => console.log('Restaurant added:', restaurant.restaurantName))
      .catch(err => console.error('Error adding restaurant:', err));
  })
  .on('end', () => {
    console.log('CSV file successfully processed and data inserted into MongoDB');
  });