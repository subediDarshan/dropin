"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { decodeBase64, decryptBlob } from "@/utils/crypto";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaDownload, FaRocket, FaShieldAlt, FaBolt, FaFile, FaExclamationTriangle, FaCheckCircle, FaSpinner } from "react-icons/fa";
import Link from "next/link";

export default function DownloadPageContent() {
    const searchParams = useSearchParams();
    const fileUrl = searchParams.get("url");
    const fileType = searchParams.get("fileType");
    const id = Number(searchParams.get("id"));
    const deleteOnDownload = searchParams.get("deleteOnDownload");

    const [status, setStatus] = useState("Accessing file...");
    const [isProcessing, setIsProcessing] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [hasError, setHasError] = useState(false);

    const trpc = useTRPC();
    const deleteFileMutation = useMutation(trpc.deleteFile.mutationOptions());
    const {data, isLoading, isError} = useQuery(trpc.getFileRecord.queryOptions({id}))
    
    useEffect(() => {
        const run = async () => {
            try {
                console.log(data);
                if(!data) {
                    setStatus("This file has expired or been deleted");
                    setHasError(true);
                    setIsProcessing(false);
                    return;
                }
                setStatus("🔐 Decrypting your file...");
                const hash = window.location.hash.slice(1);
                if (!fileUrl || !hash) {
                    setStatus("Missing file or decryption key");
                    setHasError(true);
                    setIsProcessing(false);
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

                setStatus("📥 Downloading encrypted file...");
                const res = await fetch(fileUrl);
                const encryptedBlob = await res.blob();

                setStatus("🔓 Decrypting file...");
                const decryptedBlob = await decryptBlob(encryptedBlob, key, iv);

                setStatus("🚀 Preparing download...");
                const url = URL.createObjectURL(decryptedBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `decrypted_file.${fileType}`;
                a.click();
                
                setStatus("✅ Download complete!");
                setIsProcessing(false);
                setIsComplete(true);

                if (deleteOnDownload === "true") {
                    await deleteFileMutation.mutateAsync({ id });
                }
            } catch (err) {
                console.error(err);
                setStatus("❌ Failed to decrypt or download the file");
                setHasError(true);
                setIsProcessing(false);
            }
        };
        
        if(!isLoading && !isError) {
            run();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileUrl, fileType, id, deleteOnDownload, data, isLoading, isError]);

    const getStatusIcon = () => {
        if (hasError) return <FaExclamationTriangle className="text-[#FF8383]" />;
        if (isComplete) return <FaCheckCircle className="text-[#3A994C]" />;
        return <FaSpinner className="text-[#56A2E8] animate-spin" />;
    };

    const getStatusColor = () => {
        if (hasError) return "text-[#FF8383]";
        if (isComplete) return "text-[#3A994C]";
        return "text-[#56A2E8]";
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header with branding */}
                <div className="text-center mb-8">
                    <div className="text-4xl lg:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-[#56A2E8] to-[#3A994C] bg-clip-text text-transparent">
                            Dropin
                        </span>
                    </div>
                    <div className="text-lg lg:text-xl text-gray-600 dark:text-gray-400">
                        <span className="text-[#56A2E8]">🚀 Lightning Fast</span>
                        <span className="mx-2">•</span>
                        <span className="text-[#3A994C]">🔐 Secure</span>
                        <span className="mx-2">•</span>
                        <span className="text-[#FF8383]">⚡ Hassle-free</span>
                    </div>
                </div>

                {/* Main content area */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left side - Marketing content */}
                    <div className="border-4 border-[#56A2E8] rounded-4xl w-full lg:w-1/2 p-6 lg:p-8">
                        <div className="text-2xl lg:text-3xl font-bold mb-6 text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <FaRocket className="text-[#FF8383]" />
                                <span className="bg-gradient-to-r from-[#56A2E8] to-[#3A994C] bg-clip-text text-transparent">
                                    Why Dropin?
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4 border-2 border-[#56A2E8]">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaShieldAlt className="text-[#3A994C] text-xl" />
                                    <span className="font-semibold text-lg text-gray-800">End-to-End Encryption</span>
                                </div>
                                <p className="text-gray-700 text-sm">
                                    Your files are encrypted before upload and only you have the key. We can&apos;t see your files!
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-50 to-red-50 rounded-2xl p-4 border-2 border-[#3A994C]">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaBolt className="text-[#FF8383] text-xl" />
                                    <span className="font-semibold text-lg text-gray-800">No Sign-up Required</span>
                                </div>
                                <p className="text-gray-700 text-sm">
                                    Just drag, drop, and share! No accounts, no tracking, no hassle.
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-2xl p-4 border-2 border-[#FF8383]">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaFile className="text-[#56A2E8] text-xl" />
                                    <span className="font-semibold text-lg text-gray-800">Temporary & Secure</span>
                                </div>
                                <p className="text-gray-700 text-sm">
                                    Files auto-delete after download or expiry. Your privacy is our priority.
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-center">
                            <Link href="/">
                                <button className="bg-gradient-to-r from-[#56A2E8] to-[#3A994C] text-white px-8 py-3 rounded-2xl font-semibold text-lg hover:scale-105 transition-all shadow-lg">
                                    🚀 Try Dropin Now
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Download status */}
                    <div className="border-4 border-[#3A994C] rounded-4xl w-full lg:w-1/2 p-6 lg:p-8">
                        <div className="text-center">
                            <div className="text-2xl lg:text-3xl font-bold mb-8">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <FaDownload className="text-[#3A994C]" />
                                    <span className="text-[#3A994C]">File Download</span>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 min-h-[300px] flex flex-col items-center justify-center">
                                <div className="text-6xl mb-6">
                                    {getStatusIcon()}
                                </div>
                                
                                <div className={`text-xl lg:text-2xl font-semibold mb-4 ${getStatusColor()}`}>
                                    {status}
                                </div>
                                
                                {isProcessing && (
                                    <div className="text-gray-600 text-center">
                                        <p className="mb-2">Please wait while we process your file...</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-[#56A2E8] to-[#3A994C] h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                                        </div>
                                    </div>
                                )}
                                
                                {isComplete && (
                                    <div className="text-center">
                                        <div className="text-[#3A994C] text-lg mb-4">
                                            🎉 Your file has been downloaded successfully!
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {deleteOnDownload === "true" ? 
                                                "🔥 This file has been automatically deleted for security." :
                                                "⏰ This file will expire based on the sender's settings."
                                            }
                                        </div>
                                    </div>
                                )}
                                
                                {hasError && (
                                    <div className="text-center">
                                        <div className="text-[#FF8383] text-lg mb-4">
                                            Something went wrong with the download.
                                        </div>
                                        <div className="text-gray-600 text-sm mb-4">
                                            The file might be expired, deleted, or the link might be invalid.
                                        </div>
                                        <Link href="/">
                                            <button className="bg-[#56A2E8] text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-600 transition-all">
                                                Upload Your Own File
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer tagline */}
                <div className="text-center mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border-2 border-[#56A2E8]">
                    <div className="text-lg font-semibold text-gray-800 mb-2">
                        ✨ Share files the modern way with Dropin
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="text-[#56A2E8]">📤 Upload</span>
                        <span className="mx-2">→</span>
                        <span className="text-[#3A994C]">🔗 Share</span>
                        <span className="mx-2">→</span>
                        <span className="text-[#FF8383]">🚀 Done</span>
                    </div>
                </div>
            </div>
        </div>
    );
}