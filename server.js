require('dotenv').config();
const express = require('express');
const { MongoClient } = require("mongodb");
const app = express();


app.get('/', (req,res)=>{
    res.status(200).json({key: "Working"});
});

app.get('/download', (req,res)=>{
    res.download("server.js")
});

const userRouter = require('./routes/users');
app.use('/users', userRouter);
app.listen(3001);
