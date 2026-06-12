import prisma from "../config/prisma.js"

export const findUserById = async (id) => {
  return await prisma.user.findFirst({
    where: {
      id,
    },
  });
};

export const findUserByEmail = async (email)=>{
    return await prisma.user.findUnique({
        where : {
            email 
        }
    }); 
}

export const updateUser = async (id,body)=>{

    const conflict = await prisma.user.findFirst({
        where : {
            email : body.email,
            NOT :{
                id : id 
            }
        }
    })

    if(conflict) return false 

    return await prisma.user.update({
        where : {
            id
        },
        data : body
    })
}

export const createUser = async (data)=>{
    return await prisma.user.create({data})
}

export const deleteUser = async (id)=>{
    return await prisma.user.delete({
        where : {
            id
        }
    })
}