const express = require('express')
const { port} = require('./Model/config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookies = require('cookies')
const cookies_parser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const crypt = require('bcryptjs')
const {user} = require('./Model/user')
const env = require('dotenv')
const ws = require('ws')
const {msgs} = require('./Model/Messages')
const fs = require('fs')
env.config()
const url = process.env.MONGO_URL
const app = express()
const jwtSec =process.env.JWT_SECRET
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookies_parser())
app.use('/uploads', express.static(__dirname+'/uploads'))
const numSaltRounds = 8;
app.post('/register', async (req, res) => {
    const { userName, password } = req.body;
    
    try {
        const cryptedPassword = crypt.hashSync(password , numSaltRounds)
        const find_user = await user.findOne({ userName: userName });
        if (!find_user) {
            const new_user = await user.create({ userName, password: cryptedPassword });
            console.log(new_user)
            res.json(new_user) 
        }else {
            console.log(find_user)
            res.json('name deja exist ')
        }
    } catch (err) {
        console.error('Error in the register API:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/login' , async (req , res)=>{
    const {userName , password} = req.body
    const find_user = await user.findOne({userName : userName})
    try {
        if (find_user) {
            const comp_password = crypt.compareSync(password , find_user.password)
            if (comp_password) {
                jwt.sign({userName : userName , userId : find_user._id}, jwtSec , {} , (err, token)=>{
                    if (err) throw err.message
                    console.log(token)
                    res.cookie('token', token).json(find_user)
                })
            }else {
                res.json('wrong pass')
            }
        }else {
            res.json('not found')
        }
    }catch(err) {
        console.log(err.message)
    }
})
app.get('/logout' , async (req , res)=>{
   res.cookie('token', '').json(true) 
})
app.get('/profile' , async (req , res)=>{
    const token = req.cookies?.token 
    if (token) {
        const verify = jwt.verify(token , jwtSec , {} , (err , result)=> {
            if (err) throw err.message 
            res.json(result)
        })
    }else {
        res.json('not logged')
    }
})
app.get('/getMessages/:id' , async (req , res)=>{
    const {id} = req.params
    try {
        const getAllMyMessages = await msgs.find({$or : [{senderId : id } , {recId  :id}]})
        res.json(getAllMyMessages)
    }catch(err) {
        console.log(err.message)
    }
})
mongoose.connect(url).then((result)=>{
    console.log("coonected to the database")
}).catch((err)=>{
    console.log('Oops somthing happend ....')
})
app.post('/logout',(req , res)=>{
    res.cookie('token' , '').json(true)
} )

const server = app.listen(port)
const wss = new ws.WebSocketServer({server})
wss.on('connection' , (connection , req)=>{
    const cookies = req.headers.cookie ; 
    //set all people 
    if (cookies) {
        const token = cookies.split(';').find(str => str.startsWith('token') ||str.startsWith(' token') )
        if(token) {
            const rightToken = token.split('=')[1]
            if(rightToken) {
                jwt.verify(rightToken, jwtSec , {} , (err , result)=>{
                    if (err) throw err 
                    const {userName , userId} = result
                    connection.userId = userId 
                    connection.userName = userName
                })
            }
        }
    }
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify(
            {
                "online" : [...wss.clients].map(c => ({userId : c.userId , userName : c.userName}))
            }
        ))
    })

    connection.on('message' ,async (message)=>{
        const Decodedmessage =JSON.parse(message.toString()).message
        const {rec , text , sender, file} = Decodedmessage 
        if (file){
            const parts = file?.name.split('.')
            
            const ext = parts[parts.length -1]
            console.log(ext)
            var filename = Date.now() + '.' + ext
            const bufferData = new Buffer(file.data , 'base64')
            fs.writeFile(__dirname + '/uploads/'+filename , bufferData , ()=>{
                console.log("file saved")
            } )
        }
        if (rec && text && sender || file) {
            [...wss.clients].filter((c)=> c.userId == rec).forEach((c)=> c.send(JSON.stringify({"text" : text , "rec" : rec , sender: sender})))
            const newMessage = await msgs.create({
                senderId : sender , 
                recId : rec , 
                file : filename,
                messages : {
                    message : text 
                }
            })
            console.log('file name : ')
            console.log(filename)
            
        }
    })
    //

})