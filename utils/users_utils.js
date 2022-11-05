const dbutil = require('./db_utils');

async function getAllUsers(){
    return await dbutil.connect(async (db, client)=>{
        return db.collection('users').find().toArray();
    });
}

module.exports = {getAllUsers: getAllUsers}