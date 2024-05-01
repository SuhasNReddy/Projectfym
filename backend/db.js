const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(process.env.MONGODB_URI)
        .then(client => {
            dbConnection = client.db();
            console.log("DB connected");

            // Set up indexes after connection is established
            setUpIndexes(dbConnection);

            cb();
        })
        .catch(error => {
            console.log(error);
            cb(error);
        });
    },
    getDb: () => dbConnection
};

async function setUpIndexes(db) {
    try {
        // Creating an index on the 'email' field of the 'business' collection
        await db.collection('business').createIndex({ email: 1 }, { unique: true });

        // Additional indexes can be created similarly
        
        // await db.collection('product').createIndex({ businessId: 1 });
        // await db.collection('orders').createIndex({ businessId: 1 });
        
        console.log("Indexes created successfully");
    } catch (error) {
        console.error("Error setting up indexes:", error);
    }
}
