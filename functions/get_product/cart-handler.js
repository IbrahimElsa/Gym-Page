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

  if (event.httpMethod === 'POST') {
    const cartItem = JSON.parse(event.body);

    try {
      const cart = db.collection('cart');
      await cart.insertOne(cartItem);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Item added to cart' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const cart = db.collection('cart');
      const cartItems = await cart.find({}).toArray();
      return {
        statusCode: 200,
        body: JSON.stringify(cartItems),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      };
    }
  }
};
