const e = require('express');
const express = require('express');
const router = express.Router();
const userUtils = require('../utils/users_utils');

router.use((req,res,next)=>{
    // logger middleware for all routes
    console.log(req.originalUrl);
    next();
});

router.get('/', async (req,res) =>{
    // get all users
    res.status(200).json(await userUtils.getAllUsers());
});
router.get('/potentials', async(req,res) => {
    // get all potentials
    res.status(200).json(await userUtils.getAllPotentials());
});
router.post('/google-login', async(req,res) => {
    // new login in the system
    const token = req.body.token;
    if(token == undefined){
        res.status(400).send('the body should consist of only the token');
        return;
    }
    let result = await userUtils.handleTokenLogIn(token);
    // set a cookie in case the user is an admin
    if(result != null)
        res.cookie('secret',result._id.toString());
    res.status(200).json(result);    
});
router.post('/user/:potentialId', async(req,res) => {
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
});
router.put('/user/sub-date/:userId', async(req,res) => {
    const userId = req.params.userId;
    const time = req.query.time;
    const newSubDate = req.query.subDate;
    const coockies = req.cookies;
    if(!(await userUtils.checkIfAdmin(coockies.secret))){
        res.status(401).send('missing cookie');
        return;
    }
    if(userId == undefined || time == undefined) {
        res.status(400).send('missing user id or time');
        return;
    }
    res.status(200).json(await userUtils.updateSubDate(userId, time, newSubDate));
});
router.delete('/user/:userId', async (req,res) => {
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
});

module.exports = router;