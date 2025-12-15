import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken=(req,res,next)=>{
    const tokenHeader = req.header('Authorization');
    if (!tokenHeader) {
        return res.status(401).json({ error: "Access Denied: No token provided" });
    }
    try{
        const token=tokenHeader.split(" ")[1];
        const verifiedUser=jwt.verify(token,process.env.JWT_SECRET);
        req.user = verifiedUser;
        next();
    }catch(error){
        res.status(400).json({ error: "Invalid Token" });
    }
}