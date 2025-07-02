"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { decodeBase64, decryptBlob } from "@/utils/crypto";

export default function DownloadPage() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState("Decrypting...");

    useEffect(() => {
        const run = async () => {
            try {
                const fileUrl = searchParams.get("url");
                const fileType = searchParams.get("fileType");
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
            } catch (err) {
                console.error(err);
                setStatus("Failed to decrypt/download");
            }
        };

        run();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg font-medium">{status}</p>
        </div>
    );
}
