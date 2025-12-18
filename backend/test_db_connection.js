require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
const uri = process.env.MONGO_URI || process.env.MONGO_URL;
console.log('Connection string exists:', !!uri);

if (!uri) {
    console.error('MONGO_URI/MONGO_URL is missing in .env');
    process.exit(1);
}

// Set a shorter timeout for testing
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed:', err);
        process.exit(1);
    });
