const { MongoClient } = require("mongodb");

const uri =
  "mongodb://airlinedb_user:8649OV57IGR3Y1JS@ec2-43-205-133-199.ap-south-1.compute.amazonaws.com/admin?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.3"; // MongoDB connection URI
const dbName = "gstservice";

// Create a MongoDB client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fetchDBCollection(conRequest) {
  try {
    await client.connect(); // Connect to MongoDB
    console.log("Connected to MongoDB", conRequest);

    const db = client.db(dbName); // Get the database instance
    const collection = db.collection("irn"); // Get the collection
    // Fetch data from the collection
    const documents = await collection
      .find({ ...conRequest.payload })
      .limit(1)
      .toArray();

    const jsonData = JSON.parse(JSON.stringify(documents));
    return jsonData;
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
  } finally {
    await client.close(); // Close the MongoDB connection
    console.log("Disconnected from MongoDB");
  }
}

async function updateDBCollection(updateArgs) {
  try {
    await client.connect(); // Connect to MongoDB

    const db = client.db(dbName); // Get the database instance
    const collection = db.collection("irn"); // Get the collection
    // Fetch data from the collection

    const filter = { Irn: updateArgs.irn }; // Filter to find the document to update
    const update = { $set: { s3_url: updateArgs.url } }; // Update to apply
    const documents = await collection.updateOne(filter, update);
    return true;
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
  } finally {
    await client.close(); // Close the MongoDB connection
    console.log("Disconnected from MongoDB");
  }
}

module.exports = {
  fetchDBCollection,
  updateDBCollection,
};
