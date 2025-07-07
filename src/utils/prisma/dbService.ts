import prisma from "./prisma"
import { FileExpiry } from "@/generated/prisma/client"

export const addFileUrl = async ({fileLink, expiry}: {fileLink: string, expiry: Date}):Promise<FileExpiry> => {
    const newFileLink = await prisma.fileExpiry.create({
        data: {fileLink, expiry}
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

export const deleteFileUrls = async (ids: number[]) => {
    await prisma.fileExpiry.deleteMany({
        where: {id: {in: ids}}
    })
}
