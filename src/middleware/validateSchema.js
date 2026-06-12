import { ZodError } from "zod";

export const validateSchema = (schema)=>{
    return (req,res,next)=>{
        try{

            req.body = schema.parse(req.body);

            next();
        }catch(err){

            if (err instanceof ZodError){
                return res.status(400).json({
                  success: false,
                  errors: err.issues.map((issue) => ({
                    field: issue.path[0],
                    message: issue.message,
                  })),
                });
            }

            return res.status(500).json({
                message : err.message
            })
        }
    }
}