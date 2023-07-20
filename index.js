const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');

const app = express();
require("dotenv").config();
const URI = process.env.MONGOURI;
const PORT = process.env.PORT || 5000;
mongoose.connect(URI);




app.use(cors())
app.use(express.json());//this is a middleware to use req.body 

app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.get('/',(req,res)=>{
    res.send('Hello Anish');
});
app.listen(5000,()=>{console.log('listening on port 5000');});