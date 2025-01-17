const express=require('express')
const mongoose=require('mongoose')


const PORT=5000

const app=express()

//Connecting mongodb

mongoose.connect("mongodb://127.0.0.1:27017/new-db")
.then(()=>{
  console.log('mongo db connected sucessfully')
})
.catch(err=>console.lo('mongo db err',err))


// creating schema for entering data of new users

const userSchema=new mongoose.Schema({
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,

  },
  gender:{
    type:String
  },
  age:{
    type:Number,

  },
  email:{
    type:String,
    required:true
  }
},{timestamps:true})

const user =mongoose.model('user',userSchema)


//Making routes
app.get('/api/users',(req,res)=>{
  return res.send("Heloo")
})

// making an post request
app.post('/api/users',async(req,res)=>{
  const body=req.body
  if(!body.firstName||!body.lastName||!body.gender||!body.age||!body.email){
    return res.status(400).json({msg:'All fields are required'})
  }
const final =await user.create({
  firstName:body.firstName,
  lastName:body.lastName,
  gender:body.gender,
  age:body.age,
  email:body.email


})
console.log(final)
  return res.status(201).json({status:"Sucess"})
})

app.listen(PORT,()=>{console.log(`Listening on port ${PORT}`)})