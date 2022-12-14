const express = require('express');
const router = express.Router();
const userUtils = require('../utils/users_utils');
const asyncHandler = require('express-async-handler')

//
router.use((req,res,next)=>{
    // logger middleware for all routes
    console.log(req.originalUrl);
    next();
});

router.get('/',asyncHandler(async (req,res) =>{
    // get all users
    res.status(200).json(await userUtils.getAllUsers());
}));
router.get('/potentials', asyncHandler(async(req,res) => {
    // get all potentials
    res.status(200).json(await userUtils.getAllPotentials());
}));
router.post('/google-login', asyncHandler(async(req,res) => {
    // new login in the system
    const token = req.body.token;
    if(token == undefined){
        res.status(400).send('the body should consist of only the token');
        return;
    }
    let result = await userUtils.handleTokenLogIn(token);
    // set a cookie in case the user is an admin
    if(result != null)
        res.cookie('secret',result._id.toString(), { sameSite: 'none', secure: true});
    res.status(200).json(result);    
}));
router.post('/user/:potentialId', asyncHandler(async(req,res) => {
    // add to users from potentials
    const potentialId = req.params.potentialId;
    const coockies = req.cookies;
    if(!(await userUtils.checkIfAdmin(coockies.secret))){
        res.status(401).send('missing cookie');
        return;
    }
    if(potentialId == undefined){
        res.status(400).send('missing potential id');
        return;
    }
    res.status(200).json(
        await userUtils.addUserFromPotentials(potentialId, req.query.rank, req.query.lastSubscriptionDate, req.query.subscriptionTime, req.query.joinDate));
}));
router.put('/user/:userId', asyncHandler(async(req,res) => {
    const userId = req.params.userId;
    const coockies = req.cookies;
    if(!(await userUtils.checkIfAdmin(coockies.secret))){
        res.status(401).send('missing cookie');
        return;
    }
    if(userId == undefined) {
        res.status(400).send('missing user id or time');
        return;
    }
    res.status(200).json(await userUtils.updateUserData(userId, req.query.rank, req.query.lastSubscriptionDate, req.query.subscriptionTime, req.query.joinDate));
}));
router.delete('/user/:userId', asyncHandler(async (req,res) => {
    const userId = req.params.userId;
    const coockies = req.cookies;
    if(!(await userUtils.checkIfAdmin(coockies.secret))){
        res.status(401).send('missing cookie');
        return;
    }
    if(userId == undefined) {
        res.status(400).send('missing user id');
        return;
    }
    res.status(200).json(await userUtils.removeUser(userId));
}));
router.delete('/potential/:potentialId', asyncHandler(async (req, res) => {
    const potentialId = req.params.potentialId;
    const coockies = req.cookies;
    if(!(await userUtils.checkIfAdmin(coockies.secret))){
        res.status(401).send('missing cookie');
        return;
    }
    if(potentialId == undefined) {
        res.status(400).send('missing user id');
        return;
    }
    res.status(200).json(await userUtils.removePotential(potentialId));
}));

module.exports = router;