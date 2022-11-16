require('dotenv').config();
const { ObjectId } = require("mongodb");
const dbutil = require('./db_utils');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function getAllUsers(){
    return await dbutil.getEntireCollection('users');
}
async function getAllPotentials(){
    return await dbutil.getEntireCollection('potentials');
}
async function getUserById(id){
    const users = await getAllUsers();
    let user = users.filter(u=>u._id.toString()==id)[0];
    return user;
}
async function getPotentialById(id){
    const potentials = await getAllPotentials();
    let potential = potentials.filter(p => p._id.toString()==id)[0];
    return potential;
}
async function addNewUser(user){
    return await dbutil.addNewItemToCollection('users', user);
}
async function removePotential(potentialId){
    return await dbutil.removeItemFromCollection('potentials', potentialId);
}
async function removeUser(userId){
    return await dbutil.removeItemFromCollection('users', userId);
}
async function getGoogleClientData(token){
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const {name, email, picture} = ticket.getPayload();
    return {name, email, picture};
}
async function handleTokenLogIn(token){
    // if token belongs to in-system user, return him, else add him to potentials
    const users = await getAllUsers();
    const potentials = await getAllPotentials();
    const {name, email, picture} = await getGoogleClientData(token);
    let relevantUser = users.filter(u => u.email == email)[0];
    if(relevantUser != undefined){
        // user is in the system
        return {...relevantUser, inUsers: true};
    } 
    let userInPotentials = potentials.filter(p => p.email == email)[0];
    if(userInPotentials == undefined){ // user needs to be inserted in potentials
        userInPotentials = {name: name, email: email, profilePic: picture}
        await dbutil.addNewItemToCollection('potentials', userInPotentials)
    }
    return {...userInPotentials, inUsers: false};
}

async function checkIfAdmin(id){
    const user = await getUserById(id);
    return user.admin;
}
async function addUserFromPotentials(potentialId, rank, lastSubscriptionDate, joinDate){
    let potential = await getPotentialById(potentialId);
    if(potential != null){
        potential = {...potential,
             rank: rank, lastSubscriptionDate: lastSubscriptionDate, subscriptionTime:subscriptionTime, joinDate: joinDate, admin: false};
        await addNewUser(potential);
        await removePotential(potentialId);        
    }            
}
async function updateSubDate(userId, time, newSubDate){
    return await dbutil.connect((db, client) => {
        return db.collection('users')
        .updateOne({_id: new ObjectId(userId)}, {$set: {lastSubscriptionDate: newSubDate, subscriptionTime: time}});
    });
}
module.exports = { 
    getAllUsers: getAllUsers, 
    getAllPotentials: getAllPotentials, 
    getGoogleClientData: getGoogleClientData, 
    handleTokenLogIn: handleTokenLogIn, 
    getUserById: getUserById,
    checkIfAdmin: checkIfAdmin,
    getPotentialById: getPotentialById,
    addUserFromPotentials: addUserFromPotentials,
    removeUser: removeUser,
    removePotential: removePotential,
    updateSubDate: updateSubDate
}