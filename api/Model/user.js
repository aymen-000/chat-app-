const mongoose = require('mongoose')
const dataShema = new mongoose.Schema({
    userName : String , 
    password : String 
})
const user = mongoose.model('user', dataShema)
module.exports = {user}