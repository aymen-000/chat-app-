const { ObjectId, Timestamp } = require('mongodb')
const mongoose = require('mongoose')
const { user } = require('./user')
const model = new mongoose.Schema({
    senderId : {type : ObjectId , ref : "user" } ,
    recId : {type : ObjectId , ref : "user"} , 
    file : String ,
    messages : { 
        message : String,
    },
} ,{ timestamps: true } )
const msgs = new mongoose.model('messages' , model)
module.exports = {msgs}