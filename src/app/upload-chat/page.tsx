"use client";

import { useState } from "react";
// import { UploadDropzone } from "@uploadthing/react";
// import type { OurFileRouter } from "./api/uploadthing/core";
import { encodeBase64, generateAESKey, encryptFile } from "@/utils/crypto";

export default function HomePage() {
    const [shareLink, setShareLink] = useState<string | null>(null);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8">
            <h1 className="text-2xl font-bold mb-4">🔐 Secure File Upload</h1>

            <input
                type="file"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // Generate key + IV
                    const key = await generateAESKey();
                    const { encryptedBlob, iv } = await encryptFile(file, key);

                    // Upload encrypted blob manually using UploadThing fetch
                    const formData = new FormData();
                    formData.append(
                        "file",
                        new File([encryptedBlob], file.name + ".enc")
                    );

                    const res = await fetch("/api/uploadthing?actionType=upload&slug=fileUploader", {
                        method: "POST",
                        body: formData,
                    });

                    if(!res) return alert("error after fetch");
                    console.log("this is res: ", res);
                    
                    const json = await res.json();
                    const uploadedUrl = json[0]?.ufsUrl as string;
                    if (!uploadedUrl) return alert("Upload failed");

                    const keyData = await crypto.subtle.exportKey("raw", key);
                    const combinedKey = encodeBase64(
                        new Uint8Array([...new Uint8Array(keyData), ...iv])
                    );

                    const finalLink = `/f/view?url=${encodeURIComponent(
                        uploadedUrl
                    )}#${combinedKey}`;
                    setShareLink(finalLink);
                }}
            />

            {shareLink && (
                <div className="mt-6">
                    <p className="mb-2">Your secure link:</p>
                    <a
                        href={shareLink}
                        className="text-blue-600 underline"
                        target="_blank"
                    >
                        {window.location.origin + shareLink}
                    </a>
                </div>
            )}
        </main>
    );
}
