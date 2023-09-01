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
    const db = await connectToDatabase(MONGODB_URI);
    const collection = db.collection('database');
    
    // Fetch the unique identifier from the query string
    const uniqueId = event.queryStringParameters.id;
    
    // Query the database using the unique ID
    const data = await collection.find({ "_id.$oid": uniqueId }).toArray();
    
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

  

