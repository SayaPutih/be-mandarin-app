import prisma from "../config/prisma.js"
import bcrypt from "bcrypt";

export const findAllUser = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const createTeacher = async (data)=>{
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "TEACHER",
      },
    });
}

export const createUser = async (data)=>{
    return await prisma.user.create({data})
}

export const findUserById = async (id) => {
    console.log(id)
  return await prisma.user.findUnique({
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

export const deleteUser = async (id)=>{

    await prisma.flashCardAttempt.deleteMany({
      where: {
        userId: id,
      },
    });

    await prisma.wordMemoryState.deleteMany({
      where: {
        userId: id,
      },
    });
    
    return await prisma.user.delete({
        where : {
            id
        }
    })
}

export const getUserHalfLife = async (id)=>{
    return 0
}