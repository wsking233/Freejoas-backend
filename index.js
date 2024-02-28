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
const dotenv = require('dotenv').config();
//check if the .env file is present
if(dotenv.error){
    throw dotenv.error;
}

//ininialize express app
const express = require('express'); 

const PORT = process.env.PORT; 

// Create an express app
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World! - from freejoas-backend');
    });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    });

// Connect to MongoDB
const MONGO_DB_URL = process.env.MONGO_DB_URL;

const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGO_DB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("MongoDB is successfully connected!");
      console.log("----------------------------------");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);