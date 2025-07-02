"use client";

import { UploadButton } from "@/utils/uploadthing";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {/* <UploadButton
                endpoint="fileUploader"
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    alert("Upload Completed");
                    setFileUrl(res[0].ufsUrl)
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />
            {fileUrl && <Link href={fileUrl!}>{fileUrl}</Link>} */}

            
            <input 
                type="file" 
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if(!file) alert('File not uploaded')
                    console.log(file?.name);
                    
                    
                }
            }/>




        </main>
    );
}
