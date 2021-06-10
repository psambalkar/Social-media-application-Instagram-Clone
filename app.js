const express = require ('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI}= require('./config/keys')
const User = require('./models/user');
const Post = require('./models/post')
app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/post')) 
app.use(require('./routes/user'))


//code for production.first serve the static files to heroku and them send index.html file
if(process.env.NODE_ENV == "production"){
 app.use(express.static('client/build'))
 const path = require('path')
 app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,'client','build','index.html'))
 })
}
//or
//require('./models/user')
//mongoose.model("User")
mongoose.connect(MONGOURI,{useNewUrlParser:true,
useUnifiedTopology:true})
// mongoose.connection.on('connected',()=>{
//  console.log("connection to DB sucess")
// })
// mongoose.connection.on('error',(err)=>{
//  console.log("err connnecting",err)
// })
.then(()=>{
 console.log("DB connection success")
}).catch((error)=>{console.log(error)})

const customMiddleware= (req,res,next)=>{
 console.log("Hello from middleware")
 next()
}

// app.get('/',(req,res)=>{
//  console.log("hello")
//  res.send("hello world")
//  }) 
// // app.use(customMiddleware) this is for executing the middleware globally
// app.get('/about',customMiddleware,(req,res)=>{
//  console.log("about page");
//  res.send("about")
// })

app.listen(PORT,()=>{
 console.log("server is running succesfully on ",PORT)
})