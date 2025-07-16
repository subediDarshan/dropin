// import React from "react";

// function Hero() {
//     const data = [
//         { type: "image", size: "4MB" },
//         { type: "video", size: "16MB" },
//         { type: "audio", size: "8MB" },
//         { type: "blob", size: "8MB" },
//         { type: "pdf", size: "4MB" },
//         { type: "text", size: "64kB" },
//     ];

//     return (
//         <>
//             <section className="container mx-auto w-full h-full flex flex-col justify-between md:flex-row gap-10 pt-4">
//                 <div className="border-4 border-[#56A2E8] rounded-4xl md:w-1/2 h-1/2 md:h-1/1 p-8 flex flex-col">
//                     <div className="text-4xl">
//                         Upload a file
//                         <br />
//                         Get a unique link
//                         <br />
//                         And share it
//                         <br />
//                         No sign-up needed.
//                         <br />
//                         Secure, temporary, and hassle-free.
//                     </div>
//                     <div>
//                         Instructions:
//                         <div className="max-w-md mx-auto mt-10 rounded-lg overflow-hidden border border-gray-700">
//                             <table className="w-full text-left text-sm text-white bg-[#1e1e1e]">
//                                 <thead className="bg-[#2a2a2a] border-b border-gray-600">
//                                     <tr>
//                                         <th className="px-4 py-3 font-medium">
//                                             File Type
//                                         </th>
//                                         <th className="px-4 py-3 font-medium">
//                                             Default Max Size
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {data.map((row, index) => (
//                                         <tr
//                                             key={index}
//                                             className={
//                                                 index % 2 === 0
//                                                     ? "bg-[#1e1e1e]"
//                                                     : "bg-[#2a2a2a]"
//                                             }
//                                         >
//                                             <td className="px-4 py-2">
//                                                 {row.type}
//                                             </td>
//                                             <td className="px-4 py-2">
//                                                 {row.size}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="border-4 border-[#56A2E8] rounded-4xl md:w-3/8 h-1/2 md:h-1/1 p-8">
//                     2
//                 </div>
//             </section>
//         </>
//     );
// }

// export default Hero;



"use client";

import React, { useState, useRef } from "react";
import { FaUpload, FaFile, FaLink, FaCheck, FaCopy } from "react-icons/fa";

function Hero() {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [generatedLink, setGeneratedLink] = useState<string>("");
    const [linkCopied, setLinkCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const data = [
        { type: "image", size: "4MB" },
        { type: "video", size: "16MB" },
        { type: "audio", size: "8MB" },
        { type: "blob", size: "8MB" },
        { type: "pdf", size: "4MB" },
        { type: "text", size: "64kB" },
    ];

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setUploadedFile(file);
        // Simulate link generation
        const mockLink = `https://dropin.app/f/${Math.random().toString(36).substr(2, 9)}`;
        setGeneratedLink(mockLink);
        setLinkCopied(false);
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedLink);
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

    return (
        <>
            <section className="container mx-auto w-full h-full flex flex-col justify-between md:flex-row gap-10 pt-4">
                <div className="border-4 border-[#56A2E8] rounded-4xl md:w-1/2 h-1/2 md:h-full p-8 flex flex-col">
                    <div className="text-4xl mb-8">
                        Upload a file
                        <br />
                        Get a unique link
                        <br />
                        And share it
                        <br />
                        <span className="text-2xl text-gray-600">No sign-up needed.</span>
                        <br />
                        <span className="text-2xl text-gray-600">Secure, temporary, and hassle-free.</span>
                    </div>
                    <div className="flex-1">
                        <div className="text-xl mb-4">File Size Limits:</div>
                        <div className="max-w-md mx-auto rounded-lg overflow-hidden border border-gray-700">
                            <table className="w-full text-left text-sm text-white bg-[#1e1e1e]">
                                <thead className="bg-[#2a2a2a] border-b border-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            File Type
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Max Size
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                index % 2 === 0
                                                    ? "bg-[#1e1e1e]"
                                                    : "bg-[#2a2a2a]"
                                            }
                                        >
                                            <td className="px-4 py-2 capitalize">
                                                {row.type}
                                            </td>
                                            <td className="px-4 py-2">
                                                {row.size}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div className="border-4 border-[#56A2E8] rounded-4xl md:w-1/2 h-1/2 md:h-full p-8 flex flex-col">
                    <div className="text-3xl mb-6">Upload Your File</div>
                    
                    {!uploadedFile ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div
                                className={`w-full h-64 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                                    dragActive 
                                        ? 'border-[#3A994C] bg-green-50' 
                                        : 'border-gray-400 hover:border-[#56A2E8] hover:bg-blue-50'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={onButtonClick}
                            >
                                <FaUpload className="text-6xl text-gray-400 mb-4" />
                                <div className="text-xl text-gray-600 text-center">
                                    Drag and drop your file here
                                    <br />
                                    or click to browse
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleChange}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col">
                            <div className="bg-green-50 border-4 border-[#3A994C] rounded-2xl p-6 mb-6">
                                <div className="flex items-center mb-4">
                                    <FaCheck className="text-[#3A994C] text-2xl mr-3" />
                                    <span className="text-xl font-semibold">File Uploaded Successfully!</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <FaFile className="text-gray-600 mr-2" />
                                    <span className="font-medium">{uploadedFile.name}</span>
                                </div>
                                <div className="text-gray-600">
                                    Size: {formatFileSize(uploadedFile.size)}
                                </div>
                            </div>
                            
                            <div className="border-4 border-[#FF8383] rounded-2xl p-6">
                                <div className="text-xl font-semibold mb-4 flex items-center">
                                    <FaLink className="mr-2" />
                                    Your Share Link:
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={generatedLink}
                                        readOnly
                                        className="flex-1 p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className={`p-3 rounded-lg transition-colors ${
                                            linkCopied 
                                                ? 'bg-[#3A994C] text-white' 
                                                : 'bg-[#56A2E8] text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        {linkCopied ? <FaCheck /> : <FaCopy />}
                                    </button>
                                </div>
                                {linkCopied && (
                                    <div className="text-[#3A994C] text-sm mt-2">
                                        Link copied to clipboard!
                                    </div>
                                )}
                            </div>
                            
                            <button
                                onClick={() => {
                                    setUploadedFile(null);
                                    setGeneratedLink("");
                                    setLinkCopied(false);
                                }}
                                className="mt-6 py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Upload Another File
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default Hero;
