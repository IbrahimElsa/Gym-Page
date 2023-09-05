const MongoClient = require('mongodb').MongoClient;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = await client.db();
  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {
  const db = await connectToDatabase();

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    // ... other headers ...
  };

  switch (event.httpMethod) {
    case 'POST':
      const cartItem = JSON.parse(event.body);

      try {
        const cart = db.collection('cart');
        await cart.insertOne(cartItem);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Item added to cart' }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: error.message }),
        };
      }

    case 'GET':
      try {
        const cart = db.collection('cart');
        const cartItems = await cart.find({}).toArray();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(cartItems),
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: error.message }),
        };
      }

    default:
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
  }
};
