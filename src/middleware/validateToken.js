import jwt from "jsonwebtoken";

export const validateToken = async (req,res,next)=>{
    try{
      const token = req.headers.authorization;
      //console.log("AUTH HEADER =", token);

      
      if (!token) {
        return res.status(401).json({ message: "Unauthorize" });
      }

      const tokenString = token.split(" ")[1];
      const decoded = jwt.verify(tokenString, process.env.SECRET_KEY);


      req.user = decoded;

      //console.log("----MIDDLEWARE----");
      //console.log(req.user);

      next();
    }catch(err){
        return res.status(401).json({message : "Invalid Token"})
    }
}