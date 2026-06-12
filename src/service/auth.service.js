import bcrypt from "bcrypt";
import {
  findUserByEmail,
  createUser,
  deleteUser,
  updateUser,
  findUserById,
} from "../repositories/user.repository.js";
import jwt from "jsonwebtoken";

export const MeService = async(id)=>{
  const user = await findUserById(id);
  if (!user) {
    throw new Error("Nothing with that id");
  }

  return user;
}

//kalo mau mising Params gimana ✅
export const RegisterUserService = async (body) => {
  const { email, password, name } = body;

  const exists = await findUserByEmail(email);

  if (exists) {
    throw {
      status: 409,
      message: "Email Exists",
    };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    email,
    name,
    password: hashPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
  };
};

export const LoginUserService = async (body) => {
  const request_body = body;
  const exists = await findUserByEmail(request_body.email);
  if (!exists) {
    throw {
      status: 404,
      message: "Email Doesnt Exists",
    };
  }

  const match = await bcrypt.compare(request_body.password, exists.password);
  if (!match) {
    throw {
      status: 401,
      message: "Invalid Credentials",
    };
  }

  const token = jwt.sign(
    {
      id: exists.id,
      email: exists.email,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );

  return {
    token,
  };
};

export const UpdateUserService = async (id,body)=>{
   const existsId = await findUserById(id);

   if (!existsId) {
     throw new Error("User Does not Exists");
   }

   const user = await updateUser(id,body);

   if(user == false){
    throw new Error("Email Conflict")
   }

   return true 
}

export const DeleteUserSerivce = async (id) => {

  const exists = await findUserById(id);

  if (!exists) {
    throw new Error("User Does not Exists");
  }

  const user = await deleteUser(id);

  return true;
};