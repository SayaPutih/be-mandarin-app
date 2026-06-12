import jwt from "jsonwebtoken";

export const validateToken = async (req,res,next)=>{
    try{
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorize" });
      }

      const tokenString = token.split(" ")[1];
      const decoded = jwt.verify(tokenString, process.env.SECRET_KEY);

      //ini ngapain
      req.user = decoded;


      
      console.log("----MIDDLEWARE----");
      console.log(req.user);
      //Kerlyn : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJkZWM1NDcyLWM1NzAtNDEwMy1iZGQ4LTMxMzFjOWNjMDQwYSIsImVtYWlsIjoia2VybHluQGdtYWlsLmNvbSIsImlhdCI6MTc3OTQ1MzkwMiwiZXhwIjoxNzc5NTQwMzAyfQ.B9FwkrZ04fYSKQnPbVuPSUV-JfeD4iMJtK1K9-x-s78
      //evan : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzNGZkYTM2LWRmMzUtNDQwYy1iMjUzLTExMGQxNTQ0NDYxMyIsImVtYWlsIjoiMWV2YW5kZXJAZ21haWwuY29tIiwiaWF0IjoxNzc5NDU0MjA5LCJleHAiOjE3Nzk1NDA2MDl9.D3fQY7C76FL5ui4KhBpWBkJIr8d_Re43eefpdMXO97w

      next();
    }catch(err){
        return res.status(401).json({message : "Invalid Token"})
    }
}