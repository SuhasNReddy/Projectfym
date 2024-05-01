const jwt = require('jsonwebtoken');
const db = require('../db');
const { ObjectId } = require('mongodb');

module.exports=async function requireAuth(req,res,next){
    console.log(req.path);
    const {authorization } = req.headers;
    if(!authorization){
        res.status(401).json({message:"Authorization token required"});
    }

    

    try{
        const token = authorization.split(" ")[1];
        const {id} = jwt.verify(token,process.env.SECRET_KEY);
        const dbobj = db.getDb();
        
    
        const user = await dbobj.collection('business').findOne({ _id: new ObjectId(id)});
        if (!user) {
            res.status(403).json({ message: "User not found" });
            return;
        }
        
        const { status } = user;

        if (status === 'approved') {
            req.user = id;
            
            next();
        } else if (status === 'pending') {
            res.status(403).json({ message: "pending" });
        } else if (status === 'rejected') {
            res.status(403).json({ message: "rejected" });
        } else {
            res.status(403).json({ message: "Request not authorized!!" });
        }
        
    }catch(e){
        console.log(e);
        res.status(400).json({message:"Request not authorised!!"})
    }

}