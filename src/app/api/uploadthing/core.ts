import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    fileUploader: f(["image", "video", "video", "audio", "blob", "pdf", "text"])
        .middleware(async({files}) => {
            console.log("these are the files: ", files);
            return {files}
        })
        .onUploadComplete(async ({ file }):Promise<{file_url: string}> => {
            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { file_url: file.ufsUrl };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
