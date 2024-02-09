const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define your routes before the CORS middleware
const authRoutes = require('../BackEnd/routes/auth');
const quizRoutes = require('../BackEnd/routes/quiz');
app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);

// Apply the CORS middleware
app.use(cors());

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log(error));

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connection established successfully');
});

app.get('/', (req, res) => {
    res.send('Welcome');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
