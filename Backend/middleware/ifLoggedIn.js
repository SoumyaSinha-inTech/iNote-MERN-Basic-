const jwt=require('jsonwebtoken')
 const JWT_SECRET = "secretoftheapp";

function ifLoggedIn(req,res,next) {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).send({error:"Authentication Denied"})
    }
   try{
     const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
   } catch(error){
     return res.status(401).send({error:"Authentication Denied"})
   }
}

module.exports=ifLoggedIn;