"use client";

import { useDropzone } from "@uploadthing/react";
import {
    generateClientDropzoneAccept,
    generatePermittedFileTypes,
} from "uploadthing/client";

import { useUploadThing } from "@/utils/uploadthing";
import { useCallback, useState } from "react";
import { encodeBase64, encryptFile, generateAESKey } from "@/utils/crypto";
import { fileTypeFromBlob } from "file-type";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export default function MultiUploader() {
    const [files, setFiles] = useState<File[]>([]);
    const [shareLink, setShareLink] = useState<string | null>(null);
    const [deleteOption, setDeleteOption] =
        useState<string>("Delete on download");

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);

    const trpc = useTRPC()
    const addFileUrl = useMutation(trpc.addFileUrl.mutationOptions())

    const { startUpload, routeConfig } = useUploadThing("fileUploader", {
        onClientUploadComplete: () => {
            alert("uploaded successfully!");
        },
        onUploadError: () => {
            alert("error occurred while uploading");
        },
        onUploadBegin: (fileKey: string) => {
            console.log("upload has begun for", fileKey);
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: generateClientDropzoneAccept(
            generatePermittedFileTypes(routeConfig).fileTypes
        ),
    });

    return (
        <>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div>
                    {files.length > 0 && (
                        <button
                            onClick={async () => {
                                const file = files?.[0];
                                if (!file) return;

                                // Generate key + IV
                                const key = await generateAESKey();
                                const { encryptedBlob, iv } = await encryptFile(
                                    file,
                                    key
                                );

                                const res = await startUpload([
                                    new File(
                                        [encryptedBlob],
                                        file.name + ".enc"
                                    ),
                                ]);
                                if (!res)
                                    return alert("error after startUpload");
                                console.log("this is res: ", res);
                                let fileId = undefined
                                if (deleteOption == "Delete on download") {
                                    const expiry = new Date();
                                    expiry.setMonth(expiry.getMonth() + 1);

                                    const {id} = await addFileUrl.mutateAsync({fileLink: res?.[0].serverData.file_url, expiry: expiry.toISOString()})
                                    fileId = id;
                                } else if(deleteOption == "Delete after 1 day") {
                                    const expiry = new Date();
                                    expiry.setDate(expiry.getDate() + 1);

                                    const {id} = await addFileUrl.mutateAsync({fileLink: res?.[0].serverData.file_url, expiry: expiry.toISOString()})
                                    fileId = id;
                                } else if(deleteOption == "Delete after 1 week") {
                                    const expiry = new Date();
                                    expiry.setDate(expiry.getDate() + 7);

                                    const {id} = await addFileUrl.mutateAsync({fileLink: res?.[0].serverData.file_url, expiry: expiry.toISOString()})
                                    fileId = id;
                                } else {
                                    const expiry = new Date();
                                    expiry.setMonth(expiry.getMonth() + 1);

                                    const {id} = await addFileUrl.mutateAsync({fileLink: res?.[0].serverData.file_url, expiry: expiry.toISOString()})
                                    fileId = id;
                                }

                                const uploadedUrl = res?.[0].ufsUrl as string;
                                if (!uploadedUrl) return alert("Upload failed");
                                const keyData = await crypto.subtle.exportKey(
                                    "raw",
                                    key
                                );
                                const combinedKey = encodeBase64(
                                    new Uint8Array([
                                        ...new Uint8Array(keyData),
                                        ...iv,
                                    ])
                                );

                                let fileType = (await fileTypeFromBlob(file))
                                    ?.ext;
                                if (!fileType) {
                                    fileType = file.name.substring(
                                        file.name.lastIndexOf(".") + 1
                                    );
                                }

                                const finalLink = `/f/view?url=${encodeURIComponent(
                                    uploadedUrl
                                )}&fileType=${fileType}&id=${fileId}&deleteOnDownload=${deleteOption == "Delete on download"}#${combinedKey}`;
                                setShareLink(finalLink);
                                console.log(file.name);
                            }}
                        >
                            Upload {files.length} files
                        </button>
                    )}
                </div>
                Drop files here!
            </div>
            <div>
                <label htmlFor="deleteOption">Delete Option</label>
                <select
                    id="deleteOption"
                    onChange={(e) => setDeleteOption(e.target.value)}
                >
                    <option value="Delete on download">
                        Delete on download
                    </option>
                    <option value="Delete after 1 day">
                        Delete after 1 day
                    </option>
                    <option value="Delete after 1 week">
                        Delete after 1 week
                    </option>
                    <option value="Delete after 1 month">
                        Delete after 1 month
                    </option>
                </select>
            </div>
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
        </>
    );
}
