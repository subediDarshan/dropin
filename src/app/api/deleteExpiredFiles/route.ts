import { deleteFileUrls, getExpiredFileUrl } from "@/utils/prisma/dbService";
import { utapi } from "../uploadthing/uploadthing";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", {
            status: 401,
        });
    }


    const expiredFileRecords = await getExpiredFileUrl();
    const expiredFileUrls = expiredFileRecords.map((file) => file.fileLink);
    const expiredFileKeys = expiredFileUrls.map((fileUrl) =>
        fileUrl.substring(fileUrl.lastIndexOf("/") + 1)
    );

    if (expiredFileKeys.length == 0) return;

    await utapi.deleteFiles(expiredFileKeys);

    await deleteFileUrls(expiredFileRecords.map((file) => file.id));

    return Response.json({message: "Cron job ran successfully"})
}
