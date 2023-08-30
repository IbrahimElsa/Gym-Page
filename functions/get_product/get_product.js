// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
import { MongoClient } from 'mongodb';
// require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'GymDatabase'; // replace with your database name

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(uri);
  const db = client.db(DB_NAME);
  cachedDb = db;
  return db;
}

export async function handler(event, context) {
  try {
    console.log("Connecting to database..."); // Log step
    const db = await connectToDatabase(MONGODB_URI);
    console.log("Fetching data from collection..."); // Log step
    const collection = db.collection('database');
    const data = await collection.find({}).toArray();

    console.log("Fetched Data:", data);
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("Error:", err.message); // Log error
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed fetching data', error: err.message })
    };
  }
  
  
  }
  

