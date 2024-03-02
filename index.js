/**
    * Project: Freejoas-backend
    * File: index.js
    * Desc: This is the main entry point for the backend server
    * Author: wsking233
    * Framework: Express
    * Port:4000
    * 
**/

// Load environment variables
// const dotenv = require('dotenv').config();
//check if the .env file is present
// if(dotenv.error){
//     throw dotenv.error;
// }

//ininialize express app
const express = require('express'); 
// define to the database
const mongoose = require('mongoose');
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const PORT = process.env.PORT; 

const bodyParser = require("body-parser");


// Create an express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send('Hello World! - from freejoas-backend');
    });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    });

// import models
const userModel = require('./models/userModel');
const freejoasModel = require('./models/freejoasModel');

// Import routers
const userRouter = require('./routers/userRouter');
const freejoasRouter = require('./routers/freejoasRouter');

// Use the routers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/freejoas', freejoasRouter);

// Connect to MongoDB
mongoose.connect(MONGO_DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.info('Connected to MongoDB');
    console.info(`----------------------------`);
});

