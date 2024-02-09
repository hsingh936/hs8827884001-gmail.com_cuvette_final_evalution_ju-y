const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


require('dotenv').config();


const app = express();


app.use(cors(
  {
    origin: ["https://quizzieapp-ten.vercel.app"]
  }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


mongoose.connect(process.env.MONGODB_URL)

  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.log(error));

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});


const authRoutes = require('../BackEnd/routes/auth');
const quizRoutes = require('../BackEnd/routes/quiz');
app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);


app.get('/', (req, res) => {
  res.send('Welcome');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


