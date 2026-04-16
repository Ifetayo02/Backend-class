require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute= require('./routes/user.route');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const ejs = require('ejs');



// 1. Port Fallback
const port = process.env.PORT; 
const MONGO_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors({
  origin: ['http://localhost:5174'], 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
optionsSuccessStatus: 204 
}));

// 2. MongoDB Connection with logic check
if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGODB_URI is not defined in .env");
} else {
    mongoose.connect(MONGO_URI)
        .then(() => console.log("✅ Connected to MongoDB"))
        .catch((err) => console.error("❌ MongoDB connection error:", err.message));
}

// Schema and Model


// Routes


// app.get('/signIn', (req, res) => {
//     res.render('signIn');
// });


app.use('/user', userRoute);
// 3. Listen with full URL for easy clicking
app.listen(port, () => {
    console.log(`🚀 Server is flying at: http://localhost:${port}`);
});