// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
import { MongoClient } from 'mongodb';
// require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'GymDatabase'; 

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
    const db = await connectToDatabase(MONGODB_URI);
    const collection = db.collection('database');
    
    const uniqueId = event.queryStringParameters.id;
    const random = event.queryStringParameters.random;
    
    let data;

    // Fetching a single product by ID
    if (uniqueId) {
      data = await collection.find({ "_id": new ObjectId(uniqueId) }).toArray();
    } 
    // Fetching a random set of products
    else if (random) {
      const randomCount = parseInt(random);
      data = await collection.aggregate([{ $sample: { size: randomCount }}]).toArray();
    } 
    // Fetching all products
    else {
      data = await collection.find({}).toArray();
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Failed fetching data', error: err.message })
    };
  }
}