require('dotenv').config();
const bp = require('body-parser');
const cookies = require('cookie-parser')
const express = require('express');
const cors = require('cors');
var corsOptions = {
    origin: ['http://localhost:3000', 'https://benaidlin.github.io'],
    credentials: true
}
const app = express();

// enable cors
app.use(cors(corsOptions));
// use cookies and request bodies
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }))
app.use(cookies())



app.get('/', (req,res)=>{
    res.status(200).json({key: "Working"});
});

const userRouter = require('./routes/users');
app.use('/api/users', userRouter);

// must have command line arg in the format "port:<port>"
const port = process.argv.filter(arg => arg.startsWith('port'))[0]?.split(':')[1];
if(port == undefined){
    console.log('no port specified - must have command line arg in the format "port:<port>" \n exiting...');
    return;
}
const portInt = process.env.PORT || parseInt(port);
console.log(`listening on port ${portInt}...`)
app.listen(parseInt(portInt));
