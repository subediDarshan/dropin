"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { decodeBase64, decryptBlob } from "@/utils/crypto";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function DownloadPageContent() {
    const searchParams = useSearchParams();
    const fileUrl = searchParams.get("url");
    const fileType = searchParams.get("fileType");
    const id = Number(searchParams.get("id"));
    const deleteOnDownload = searchParams.get("deleteOnDownload");

    const [status, setStatus] = useState("Accessing file...");

    const trpc = useTRPC();
    const deleteFileMutation = useMutation(trpc.deleteFile.mutationOptions());
    const {data, isLoading, isError} = useQuery(trpc.getFileRecord.queryOptions({id}))
    
    useEffect(() => {
        const run = async () => {
            try {
                console.log(data);
                if(!data) {
                    setStatus("File already expired");
                    return;
                }
                setStatus("Decrypting...");
                const hash = window.location.hash.slice(1);
                if (!fileUrl || !hash) {
                    setStatus("Missing file or key");
                    return;
                }

                const combinedKey = decodeBase64(hash);
                const keyBytes = combinedKey.slice(0, 32);
                const iv = combinedKey.slice(32);

                const key = await crypto.subtle.importKey(
                    "raw",
                    keyBytes,
                    "AES-GCM",
                    false,
                    ["decrypt"]
                );

                const res = await fetch(fileUrl);
                const encryptedBlob = await res.blob();

                const decryptedBlob = await decryptBlob(encryptedBlob, key, iv);

                const url = URL.createObjectURL(decryptedBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `decrypted_file.${fileType}`;
                a.click();
                setStatus("Download triggered");

                if (deleteOnDownload) {
                    await deleteFileMutation.mutateAsync({ id });
                }
            } catch (err) {
                console.error(err);
                setStatus("Failed to decrypt/download");
            }
        };
        
        if(!isLoading && !isError) {
            run();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileUrl, fileType, id, deleteOnDownload, data, isLoading, isError]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg font-medium">{status}</p>
        </div>
    );
}