require('dotenv').config();
const { MongoClient } = require("mongodb");

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
module.exports = {connect: connect};