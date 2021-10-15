const express = require('express');
const config= require('config')
const mongoose = require('mongoose')
const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json({extended: true}));

app.use('/api/post', require('./routes/post'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/login', require('./routes/update'))

const PORT=config.get('port');
async function start(){
    try{
        await mongoose.connect(config.get('mongoURL'))
        app.listen(PORT, ()=>console.log('App started on port:', PORT))
    }catch(e){
        console.log("SERVER ERROR!", e.message)
        process.exit(1)
    }
}
start()

