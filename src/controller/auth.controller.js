import {
  RegisterUserService,
  DeleteUserSerivce,
  UpdateUserService,
  LoginUserService,
  MeService,
} from "../service/auth.service.js";
import { registerSchema, updateSchema } from "../schema/auth/auth.schema.js";

export const Me = async (req,res)=>{
  try{

    //const {id} = req.params.id;
    const user = await MeService(req.user.id);
    return res.status(200).json({
      success: true,
      data: user,
    });

  }catch(err){
    return res.status(500).json({message : err.message})
  }
}

export const RegisterUser = async (req, res) => {
  try {

    //const body = registerSchema.parse(req.body);

    const user = await RegisterUserService(req.body);

    return res.status(201).json({
      message: "Successfull creation",
      data: user,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export const LoginUser = async (req,res)=>{
  try {
    const body = req.body;
    const token = await LoginUserService(body);
    return res.status(201).json(token);
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
}

export const UpdateUser = async (req,res)=>{
  try{  

    const {id} = req.params;
    const body = req.body;

    const user = await UpdateUserService(id,body);
    return res.status(200).json({
      "success" : true,
    })

  }catch(err){
    return res.status(500).json({message : err.message})
  }
}

export const DeleteUser = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await DeleteUserSerivce(id);

    return res.status(200).json({
      message: "Successfull Deletion"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};