// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
import { MongoClient } from 'mongodb';
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'GymDatabase'; // replace with your database name

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db(DB_NAME);
  cachedDb = db;
  return db;
}

export async function handler(event, context) {
  try {
    const db = await connectToDatabase(MONGODB_URI);
    const collection = db.collection('products'); // replace with your collection name
    const data = await collection.find({}).toArray(); // fetches all documents; modify as needed

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("Error:", err.message); // This will log the error message in the function logs
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed fetching data', error: err.message })
    };
  }
  
  }

