"use client";

import React, { useState, useCallback } from "react";
import { FaUpload, FaFile, FaLink, FaCheck, FaCopy, FaRocket, FaShieldAlt, FaBolt } from "react-icons/fa";
import { useDropzone } from "@uploadthing/react";
import {
    generateClientDropzoneAccept,
    generatePermittedFileTypes,
} from "uploadthing/client";
import { useUploadThing } from "@/utils/uploadthing";
import { encodeBase64, encryptFile, generateAESKey } from "@/utils/crypto";
import { fileTypeFromBlob } from "file-type";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

function Hero() {
    const [file, setFile] = useState<File | null>(null);
    const [shareLink, setShareLink] = useState<string | null>(null);
    const [deleteOption, setDeleteOption] = useState<string>("Delete on download");
    const [linkCopied, setLinkCopied] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const trpc = useTRPC();
    const addFileUrl = useMutation(trpc.addFileUrl.mutationOptions());

    const { startUpload, routeConfig } = useUploadThing("fileUploader", {
        // onClientUploadComplete: () => {
        //     setIsUploading(false);
        // },
        onUploadError: () => {
            alert("Error occurred while uploading");
            setIsUploading(false);
        },
        onUploadBegin: (fileKey: string) => {
            console.log("Upload has begun for", fileKey);
            setIsUploading(true);
        },
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFile(acceptedFiles?.[0]);
        setShareLink(null);
        setLinkCopied(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: generateClientDropzoneAccept(
            generatePermittedFileTypes(routeConfig).fileTypes
        ),
    });

    const data = [
        { type: "Images", size: "4MB", icon: "🖼️" },
        { type: "Videos", size: "16MB", icon: "🎬" },
        { type: "Audio", size: "8MB", icon: "🎵" },
        { type: "Documents", size: "8MB", icon: "📄" },
        { type: "PDFs", size: "4MB", icon: "📋" },
        { type: "Text Files", size: "64kB", icon: "📝" },
    ];

    const handleUpload = async () => {
        if (!file) return;

        try {
            setIsUploading(true);
            
            // Generate key + IV
            const key = await generateAESKey();
            const { encryptedBlob, iv } = await encryptFile(file, key);

            const res = await startUpload([
                new File([encryptedBlob], file.name + ".enc"),
            ]);
            
            if (!res) {
                alert("Error after startUpload");
                return;
            }

            let fileId = undefined;
            const expiry = new Date();
            
            if (deleteOption === "Delete on download") {
                expiry.setMonth(expiry.getMonth() + 1);
            } else if (deleteOption === "Delete after 1 day") {
                expiry.setDate(expiry.getDate() + 1);
            } else if (deleteOption === "Delete after 1 week") {
                expiry.setDate(expiry.getDate() + 7);
            } else if (deleteOption === "Delete after 1 month") {
                expiry.setMonth(expiry.getMonth() + 1);
            }

            const { id } = await addFileUrl.mutateAsync({
                fileLink: res?.[0].serverData.file_url,
                expiry: expiry.toISOString(),
            });
            fileId = id;

            const uploadedUrl = res?.[0].ufsUrl as string;
            if (!uploadedUrl) {
                alert("Upload failed");
                return;
            }

            const keyData = await crypto.subtle.exportKey("raw", key);
            const combinedKey = encodeBase64(
                new Uint8Array([
                    ...new Uint8Array(keyData),
                    ...iv,
                ])
            );

            let fileType = (await fileTypeFromBlob(file))?.ext;
            if (!fileType) {
                fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
            }

            const finalLink = `/f/view?url=${encodeURIComponent(
                uploadedUrl
            )}&fileType=${fileType}&id=${fileId}&deleteOnDownload=${
                deleteOption === "Delete on download"
            }#${combinedKey}`;
            
            setShareLink(finalLink);
            setIsUploading(false);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const copyToClipboard = async () => {
        if (!shareLink) return;
        
        try {
            const fullLink = window.location.origin + shareLink;
            await navigator.clipboard.writeText(fullLink);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const resetUpload = () => {
        setFile(null);
        setShareLink(null);
        setLinkCopied(false);
    };

    return (
        <section className="container mx-auto w-full flex flex-col lg:flex-row gap-4 lg:gap-10">
            {/* Left Panel - Information */}
            <div className="border-4 border-[#56A2E8] rounded-4xl w-full lg:w-1/2 min-h-[600px] lg:min-h-[700px]">
                <div className="p-4 lg:p-8 h-full flex flex-col">
                    <div className="mb-4 leading-tight">
                        <div className="text-3xl lg:text-5xl font-bold mb-3">
                            <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
                                <FaRocket className="text-[#FF8383] flex-shrink-0" />
                                <span className="bg-gradient-to-r from-[#56A2E8] to-[#3A994C] bg-clip-text text-transparent">
                                    Lightning Fast
                                </span>
                                <span className="bg-gradient-to-r from-[#FF8383] to-[#56A2E8] bg-clip-text text-transparent">
                                    File Sharing
                                </span>
                            </div>
                        </div>
                        
                        {/* Tagline */}
                        <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border-2 border-[#56A2E8]">
                            <div className="text-sm lg:text-lg font-semibold text-center text-gray-800 dark:text-gray-200">
                                <span className="text-[#56A2E8]">📤 Upload a file</span>
                                <span className="mx-2 text-gray-500">→</span>
                                <span className="text-[#3A994C]">🔗 Get a unique link</span>
                                <span className="mx-2 text-gray-500">→</span>
                                <span className="text-[#FF8383]">🚀 And share it</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm lg:text-lg text-gray-700 dark:text-gray-300 mb-2">
                            <FaShieldAlt className="text-[#3A994C] flex-shrink-0" />
                            <span>Secure • Temporary • Hassle-free</span>
                        </div>
                        <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <FaBolt className="text-[#FF8383] flex-shrink-0" />
                            No sign-up needed
                        </div>
                    </div>
                    
                    <div>
                        <div className="text-lg mb-2 font-bold text-[#56A2E8]">
                            ⚡ Upload Limits
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border-2 border-gray-200 h-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {data.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg flex-shrink-0">{item.icon}</span>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-gray-800 text-xs truncate">
                                                    {item.type}
                                                </div>
                                                <div className="text-[#56A2E8] font-bold text-sm">
                                                    {item.size}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Right Panel - Upload */}
            <div className="border-4 border-[#56A2E8] rounded-4xl w-full lg:w-1/2 min-h-[600px] lg:min-h-[700px]">
                <div className="p-4 lg:p-8 h-full flex flex-col">
                    <div className="text-xl lg:text-2xl mb-4 font-bold text-[#3A994C]">
                        🚀 Upload Your File
                    </div>
                    
                    {!file ? (
                        <div className="flex-1 flex flex-col">
                            <div
                                {...getRootProps()}
                                className={`flex-1 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                                    isDragActive 
                                        ? 'border-[#3A994C] bg-green-50 scale-105' 
                                        : 'border-gray-400 hover:border-[#56A2E8] hover:bg-blue-50 hover:text-black'
                                }`}
                            >
                                <input {...getInputProps()} />
                                <div className="text-center p-4">
                                    <FaUpload className={`text-4xl lg:text-6xl mb-4 transition-colors mx-auto ${
                                        isDragActive ? 'text-[#3A994C]' : 'text-gray-400'
                                    }`} />
                                    <div className="text-lg lg:text-xl font-semibold text-black dark:text-white mb-2">
                                        {isDragActive ? 'Drop it like it\'s hot! 🔥' : 'Drag & Drop Magic ✨'}
                                    </div>
                                    <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                                        or click to browse your files
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col">
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-4 border-[#3A994C] rounded-2xl p-4 mb-4">
                                <div className="flex items-center mb-3">
                                    <FaFile className="text-[#3A994C] text-xl mr-3 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-lg font-semibold text-black  truncate">
                                            {file.name}
                                        </div>
                                        <div className="text-sm text-gray-700 dark:text-gray-500">
                                            Size: {formatFileSize(file.size)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-black  mb-2">
                                        🗓️ Deletion Policy
                                    </label>
                                    <select
                                        value={deleteOption}
                                        onChange={(e) => setDeleteOption(e.target.value)}
                                        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-[#56A2E8] focus:outline-none bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                                    >
                                        <option value="Delete on download">🔥 Delete on download</option>
                                        <option value="Delete after 1 day">📅 Delete after 1 day</option>
                                        <option value="Delete after 1 week">🗓️ Delete after 1 week</option>
                                        <option value="Delete after 1 month">📆 Delete after 1 month</option>
                                    </select>
                                </div>
                                
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all text-sm ${
                                        isUploading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-[#3A994C] hover:bg-green-600 active:scale-95'
                                    } text-white`}
                                >
                                    {isUploading ? '🚀 Uploading...' : '🚀 Upload & Generate Link'}
                                </button>
                            </div>
                            
                            {shareLink && (
                                <div className="border-4 border-[#FF8383] rounded-2xl p-4 mb-3">
                                    <div className="text-lg font-semibold mb-3 flex items-center text-[#FF8383]">
                                        <FaLink className="mr-2 flex-shrink-0" />
                                        🎉 Your Magic Link is Ready!
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={window.location.origin + shareLink}
                                            readOnly
                                            className="flex-1 p-2 border-2 border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 text-black dark:text-white font-mono text-xs min-w-0"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                                                linkCopied 
                                                    ? 'bg-[#3A994C] text-white scale-110' 
                                                    : 'bg-[#56A2E8] text-white hover:bg-blue-600 active:scale-95'
                                            }`}
                                        >
                                            {linkCopied ? <FaCheck /> : <FaCopy />}
                                        </button>
                                    </div>
                                    {linkCopied && (
                                        <div className="text-[#3A994C] text-sm mt-2 font-semibold">
                                            ✅ Link copied! Share away!
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <button
                                onClick={resetUpload}
                                className="py-2 px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all active:scale-95 font-semibold text-sm"
                            >
                                🔄 Upload Another File
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Hero;