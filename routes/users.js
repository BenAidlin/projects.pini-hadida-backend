const express = require('express');
const router = express.Router();
const dbutil = require('./../dbutil');

async function getAllUsers(){
    return await dbutil.connect(async (db, client)=>{
        return db.collection('users').find().toArray();
    });
}

router.param('userToken', async (req, res, next, userToken) => {
    // middleware for specific parameter 
    let users = await getAllUsers();
    req.user = users.filter(us => us.userToken == userToken)[0];
    next();
});
router.use((req,res,next)=>{
    // logger middleware for all routes
    console.log(req.originalUrl);
    next();
});
router.get('/', (req,res) =>{
    res.status(200).json([{userId: 1}, {userId: 2}]);
});

router.post('/new', (req,res)=>{
    // create in db
    res.status(200).json({userId: 1});
});

router.route('/:userToken')
    .get((req,res) => {
        if(req.user != null)
            res.status(200).json(req.user);
        else res.status(404).send('no user found');
    })
    .put((req,res) => {
        res.status(200).json({token: req.params.userToken});
    })
    .delete((req,res) => {
        res.status(200).json({token: req.params.userToken});
    });

module.exports = router;