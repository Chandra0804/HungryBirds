const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const haversine = require('./utils/haversine'); 
const Restaurant = require('./models/restaurants');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const fs = require('fs');
const path = require('path')

const apiKey = 'AIzaSyAMT5TkvvSm2nKEQdzmFgCNO5F13FadaW0'; 
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const fileManager = new GoogleAIFileManager(apiKey);

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://chandrasaiteja0804:Chandra0804@cluster0.d2qbw.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });


app.get('/restaurants', async (req, res) => {
  const { page = 1, limit = 12, search = '', lat, lng, radius = 3000, city, country, averageCost, cuisines } = req.query;

  try {
    let query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    if (city) {
      query['location.city'] = city;
    }

    if (country) {
      query['location.country'] = country;
    }

    if (averageCost) {
      query.average_cost_for_two = { $lte: parseInt(averageCost) };
    }

    if (cuisines) {
      query.cuisines = { $regex: cuisines, $options: 'i' };
    }

    if (lat && lng) {
      const latFloat = parseFloat(lat);
      const lngFloat = parseFloat(lng);

      const allRestaurants = await Restaurant.find(query);
      const filteredRestaurants = allRestaurants.filter(restaurant => {
        const distance = haversine(
          latFloat,
          lngFloat,
          restaurant.location.latitude,
          restaurant.location.longitude
        );
        return distance <= radius;
      });

      const count = filteredRestaurants.length;
      const startIndex = (page - 1) * limit;
      const paginatedRestaurants = filteredRestaurants.slice(startIndex, startIndex + limit);

      res.json({
        restaurants: paginatedRestaurants,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      });
    } else {
      const count = await Restaurant.countDocuments(query);
      const restaurants = await Restaurant.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      res.json({
        restaurants,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/restaurants/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/restaurants/search', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const filePath = path.join(__dirname, 'uploads', file.originalname);
    if (!fs.existsSync(filePath)) {
        return res.status(500).send('File was not saved correctly.');
    }
    const uploadResult = await fileManager.uploadFile(filePath, {
        mimeType: file.mimetype,
        displayName: file.originalname,
    });
    const fileUri = uploadResult.file.uri;
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
    });
    const result = await model.generateContent([
        {
            fileData: {
                mimeType: file.mimetype,
                fileUri: fileUri
            }
        },
        { text: 'Identify the type of Cuisine in this picture. Just Cuisine name. nothing else is required' },
    ]);
    const cuisine = result.response.text().trim();
    const restaurants = await Restaurant.find({ cuisines: { $regex: new RegExp(cuisine, 'i') } });
    
    res.json({
        cuisine: cuisine,
        restaurants: restaurants
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to search restaurants by image.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});