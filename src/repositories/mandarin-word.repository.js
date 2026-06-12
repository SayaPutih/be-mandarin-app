import prisma from "../config/prisma.js";

export const getMandarinWordById =async (id)=>{
    return prisma.mandarinWord.findFirst({
        where : {
            id
        }
    })
}