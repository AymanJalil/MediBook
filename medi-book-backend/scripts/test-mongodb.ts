// scripts/test-mongodb.ts
import { MongoClient } from 'mongodb';

async function testConnection() {
  const uri = 'mongodb://localhost:27017/mediBook';
  const client = new MongoClient(uri);
  
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    
    // List all collections in the database
    const db = client.db('mediBook');
    const collections = await db.listCollections().toArray();
    console.log('Collections in mediBook database:');
    if (collections.length === 0) {
      console.log('No collections found (empty database)');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    return false;
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

testConnection()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });