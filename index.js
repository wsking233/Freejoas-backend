/**
    * Project: Freejoas-backend
    * File: index.js
    * Desc: This is the main entry point for the backend server
    * Author: wsking233
    * Framework: Express
    * Port:4000
    * 
**/


//load environment variables
const config = require('./server/config');
const PORT = config.PORT;

//ininialize express app
const express = require('express'); 
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');


// import models
const userModel = require('./models/userModel');
const freejoasModel = require('./models/freejoaModel');
const pendingFreejoaModel = require('./models/pendingFreejoaModel');

// Import routers
const userRouter = require('./routers/userRouter');
const freejoaRouter = require('./routers/freejoaRouter');
const verificationRouter = require('./routers/verificationRouter');
const adminRouter = require('./routers/adminRouter');

// Create an express app
const app = express();

// Use cors to allow cross-origin requests
app.use(cors());
// set request size limit before parsing
app.use(bodyParser.urlencoded({ limit:"16mb", extended: true })); // support encoded bodies
app.use(bodyParser.json({ limit: '16mb' }));
app.use(bodyParser.json()); // support json encoded bodies
    
// Use the routers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/freejoa', freejoaRouter);
app.use('/api/v1/verification', verificationRouter );
app.use('/api/v1/admin', adminRouter);

// import version 2 routers
const authRouterV2 = require('./routers/version2/authRouter');
const userRouterV2 = require('./routers/version2/userRouter');
const freejoaRouterV2 = require('./routers/version2/freejoaRouter');
const adminRouterV2 = require('./routers/version2/adminRouter');


// use version 2 routers
app.use('/api/v2/auth', authRouterV2);  // test pass
app.use('/api/v2/users', userRouterV2);  // test pass
app.use('/api/v2/freejoas', freejoaRouterV2);  // test pass
app.use('/api/v2/admin', adminRouterV2); 

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello World! - from freejoas-backend');
    });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    });

// Connect to the database
const db = require('./server/db');
db.connectDB();
