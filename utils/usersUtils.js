const dbutil = require('../utils/dbUtils');

async function getAllUsers(){
    return await dbutil.connect(async (db, client)=>{
        return db.collection('users').find().toArray();
    });
}

module.exports = {getAllUsers: getAllUsers}