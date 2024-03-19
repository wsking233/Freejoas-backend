/**
    * Project: Freejoas-backend
    * File: index.js
    * Desc: This is the main entry point for the backend server
    * Author: wsking233
    * Framework: Express
    * Port:4000
    * 
**/

///////////////////////////////////////////////////
/*************************************************/

//use this area in local environment only

// Load local environment variables
// const dotenv = require('dotenv').config();

// if(dotenv.error){//check if the .env file is present
//     throw dotenv.error;
// }

//comment this area out before pushing to cloud

/*************************************************/
///////////////////////////////////////////////////

//get environment variables
const PORT = process.env.PORT; 
const MONGO_DB_URL = process.env.MONGO_DB_URL;

//ininialize express app
const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require('cors');

// Create an express app
const app = express();

// Use cors to allow cross-origin requests
app.use(cors());
// set request size limit before parsing
app.use(bodyParser.urlencoded({ limit:"16mb", extended: true })); // support encoded bodies
app.use(bodyParser.json({ limit: '16mb' }));
app.use(bodyParser.json()); // support json encoded bodies

app.get('/', (req, res) => {
    res.send('Hello World! - from freejoas-backend');
    });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    });

// import models
const userModel = require('./models/userModel');
const freejoasModel = require('./models/freejoaModel');

// Import routers
const userRouter = require('./routers/userRouter');
const freejoaRouter = require('./routers/freejoaRouter');

// Use the routers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/freejoa', freejoaRouter);

// Connect to MongoDB
mongoose.connect(MONGO_DB_URL);
//check if the connection is successful
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.info('Connected to MongoDB');
    console.info(`----------------------------`);
});

