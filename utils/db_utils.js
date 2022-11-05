require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");

async function connect(todo){
    const client = new MongoClient(process.env.ATLAS_URI);
    let actionResult = null;
    try {
        // Connect to the MongoDB cluster        
        await client.connect();        
        let db = client.db("appdb");
        actionResult = await todo(db, client);
    } catch (e) {
        console.error(e);
        return null;
    }
    finally{
        await client.close();
    }
    return actionResult;
}
async function getEntireCollection(collection){
    return await connect(async (db, client)=>{
        return db.collection(collection).find().toArray();
    });
}
async function addNewItemToCollection(collection, item){
    return await connect(async(db,client)=>{
        return db.collection(collection).insertOne(item);
    });
}
async function removeItemFromCollection(collection, itemId){
    return await connect(async(db,client)=>{
        return db.collection(collection).deleteOne({_id: new ObjectId(itemId)});
    });
}

module.exports = {
    connect: connect,
    getEntireCollection: getEntireCollection,
    addNewItemToCollection: addNewItemToCollection,
    removeItemFromCollection: removeItemFromCollection
};