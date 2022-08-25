import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
import EmailSender from "./sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "./middleware/auth.js"

dotenv.config();
const app = express();
app.use(express.json());
// app.use(cors());
app.use(cors({ origin: `${process.env.CLIENT_URL}` }));

const MONGO_url = process.env.MONGO_DB;
async function createconnection (){
  try{
    const client = new MongoClient(MONGO_url);
    await client.connect();
    console.log("mongo connected")
    return client; 
  }
  catch(err){
    console.log("server not connected")
  }
}

const client = await createconnection();

const port = process.env.PORT || 5000;

// SEND API

app.post("/send", auth,async (req, res) => {
  try {
    const { fullName,email,to,url,bcc,subject,message} = req.body
    // console.log(fullName,email,"checking")
    EmailSender({fullName,email,url,bcc,subject,to,message})
    res.json({ msg: "Your message sent successfully" });
  } catch (error) {
    res.status(404).json({ msg: "Error ❌" });
  }
});

app.post("/login",async (req,res)=>{
  const {mail,password}= req.body;
  // console.log(mail,password)
  const finduser = await client
       .db("mern")
       .collection("users")
       .findOne({mail:mail});
  // console.log(finduser)
  if(!finduser){ 
    res.status(401).send({msg:"Invalid Credential"}) 
    return}
  const storedPassword = finduser.password;
  // console.log("stored password is : ",storedPassword)
  const passwordMatch = await bcrypt.compare(password,storedPassword)
  if(passwordMatch){
    const token = jwt.sign({id:finduser._id},process.env.SECRET_KEY);
    // console.log(token)
    res.send({message :"Successfully Login",token:token});
    return;
  }
  else{
    res.status(401).send({msg:"Invalid Credential"})
    return
  }
})

app.post("/signup",async (req,res)=>{
  const {mail,password}= req.body;
  // console.log(typeof(username),password)
  const finduser = await client
       .db("mern")
       .collection("users")
       .find({mail:mail})
       .toArray();
  if(finduser[0]){
    res.status(400).send({msg:"The user is already exists"})
    return
  }
  else{
  const hashedpassword = await genpassword(password)
  // console.log("hello",password,hashedpassword)
  const ans = await client
         .db("mern")
         .collection("users")
         .insertMany([{mail:mail,password:hashedpassword}]);
  res.send(ans)
  return
 }

})
app.use("/",(req,res)=>{
  res.send('hi')
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

async function genpassword (password)
{
  const salt = await bcrypt.genSalt(10);
  // console.log(password,"hi")
  const hashedpassword = await bcrypt.hash(password,salt)
  // console.log(hashedpassword)
  return hashedpassword
}