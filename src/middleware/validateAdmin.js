export const validateAdmin =(req,res,next)=>{

    console.log("ROLE =", req.user.role);

    
    if(req.user.role !== "ADMIN"){
        return res.status(403).json({
          message: "Forbidden",
        });
    }

    next();
}