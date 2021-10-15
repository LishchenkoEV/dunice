const {Schema, model} = require('mongoose')
const schema= new Schema({
    title:{
        type: String,
        required:true,
        unique:true},
    tags:{
        type: String,
        required:true},
    content:{
        type:String,
        required:true},
    author:{
        type:String,
        required:true,
    },
    date:{
       type: Date,
       default:Date
    }
})

module.exports = model('Post', schema)