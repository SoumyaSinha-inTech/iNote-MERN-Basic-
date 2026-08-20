const jwt=require('jsonwebtoken')

function ifLoggedIn(req,res,next) {
    const token = req.header("Authorization");
    if(!token){
        return res.status(401).send({error:"Authentication Denied"})
    }
   try{
     const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
   } catch(error){
     return res.status(401).send({error:"Authentication Denied"})
   }
}

module.exports=ifLoggedIn;