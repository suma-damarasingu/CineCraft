const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let dbConnection;

module.exports = {
    connectToDb: async (callback) => {
        try {
            await client.connect();
            console.log('Connected successfully to MongoDB');
            dbConnection = client.db('cinecraft');

            // Ensure Indexes
            await dbConnection.collection('screenplays').createIndex({ createdAt: -1 });

            return callback();
        } catch (err) {
            console.error('Failed to connect to MongoDB', err);
            return callback(err);
        }
    },
    getDb: () => dbConnection,
};
