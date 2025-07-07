import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { addFileUrl, deleteFileUrl, deleteFileUrls, getExpiredFileUrl, getFileUrl, getFlieRecord } from "@/utils/prisma/dbService";
import { utapi } from "@/app/api/uploadthing/uploadthing";

export const appRouter = createTRPCRouter({
    addFileUrl: baseProcedure
        .input(
            z.object({
                fileLink: z.string(),
                expiry: z.string()
            })
        )
        .mutation(async (opts) => {
            return await addFileUrl({fileLink: opts.input.fileLink, expiry: opts.input.expiry})
        }),
    deleteFile: baseProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async (opts) => {
            const fileUrl = await getFileUrl({id: opts.input.id})
            if(!fileUrl) throw new Error("error getting fileUrl from db");
            const fileKey = fileUrl.substring(fileUrl.lastIndexOf("/") + 1)
            await utapi.deleteFiles(fileKey);
            await deleteFileUrl({id: opts.input.id})
        }),
    deleteExpiredFiles: baseProcedure
        .mutation(async () => {
            const expiredFileRecords = await getExpiredFileUrl();
            const expiredFileUrls = expiredFileRecords.map((file) => file.fileLink)
            const expiredFileKeys = expiredFileUrls.map((fileUrl) => fileUrl.substring(fileUrl.lastIndexOf("/") + 1))
            
            if(expiredFileKeys.length == 0) return;
            
            await utapi.deleteFiles(expiredFileKeys);

            await deleteFileUrls(expiredFileRecords.map((file) => file.id));
        }),
    getFileRecord: baseProcedure
        .input(
            z.object({
                id: z.number()
            })
        )
        .query(async (opts) => {
            const result = await getFlieRecord({id: opts.input.id})
            console.log("this is result in _app", result);
            return result;
            
        })
    
});
// export type definition of API
export type AppRouter = typeof appRouter;
