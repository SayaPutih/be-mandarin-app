import { 
    findAllUser,
    findUserById,
    createTeacher,
    updateUser,
    deleteUser 
} from "../../repositories/user.repository.js";
import bcrypt from "bcrypt";


export const findAllUserService = async (page, limit) => {
  const result = await findAllUser(Number(page), Number(limit));

  return result;
};

export const findUserByIdService = async (id)=>{
    const result = await findUserById(id);
    if(!result) return null;
    return result
}

export const createATeacherService = async (name,email,password) =>{
    const result = await createTeacher({name,email,password});
    return result;
}

export const updateUserService = async (id,name,email,password)=>{
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await updateUser(id, {
      name,
      email,
      password: hashedPassword,
    });
    return result 
}

export const deleteUserService = async (id)=>{
    
    const exists = await findUserById(id);
    if (!exists) return null;

    const result = await deleteUser(id);
    return result;
}