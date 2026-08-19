//Database connection
require("dotenv").config();
const mongooseConnect=require("./config/db")
mongooseConnect();

//Express require
const express=require("express");
const app=express();
let port =process.env.PORT || 5000;

//Cors
const cors = require("cors");
app.use(cors({
    
    origin: "https://i-note-amber.vercel.app",
    credentials: true
}));

//Cookie
const cookieParser = require("cookie-parser");
app.use(cookieParser()); 

//middlewares:
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//To use routes and link to app.js:
 app.use("/user",require('./routes/user'))
 app.use("/notes",require('./routes/notes'))



app.get('/',(req,res)=>{
    res.send("Hello Guys")
})

app.listen(port)