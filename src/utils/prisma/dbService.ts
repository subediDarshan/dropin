import prisma from "./prisma"
import { FileExpiry } from "@/generated/prisma"

export const addFileUrl = async ({fileLink, expiry}: {fileLink: string, expiry: string}):Promise<FileExpiry> => {
    const newFileLink = await prisma.fileExpiry.create({
        data: {fileLink, expiry: new Date(expiry)}
    })
    return newFileLink
}

// export const getAllFileUrl = async ():Promise<FileExpiry[]> => {
//     const allFileUrl = await prisma.fileExpiry.findMany({})
//     return allFileUrl
// }

export const deleteFileUrl = async ({id}:{id: number}):Promise<void> => {
    await prisma.fileExpiry.delete({
        where: {id}
    })
}

export const deleteExpiredFileUrl = async ():Promise<void> => {
    await prisma.fileExpiry.deleteMany({
        where: {expiry: {lt: new Date()}}
    })
}

export const getFileUrl = async ({id}:{id: number}):Promise<string|undefined> =>  {
    const result = await prisma.fileExpiry.findFirst({
        where: {id}
    })
    return result?.fileLink
}

export const getExpiredFileUrl = async ():Promise<FileExpiry[]> => {
    const result = await prisma.fileExpiry.findMany({
        where: {expiry: {lt: new Date()}}
    })
    return result;
}

export const deleteFileUrls = async (ids: number[]):Promise<{count: number}> => {
    return await prisma.fileExpiry.deleteMany({
        where: {id: {in: ids}}
    })
}

export const getFlieRecord = async ({id}:{id: number}):Promise<FileExpiry|null> => {
    console.log("this is id in here: " + id);
    
    const result = await prisma.fileExpiry.findUnique({
        where: {id}
    })
    console.log("this is the result we got: ", result);
    
    return result
}