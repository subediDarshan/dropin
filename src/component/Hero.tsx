import React from "react";

function Hero() {
    const data = [
        { type: "image", size: "4MB" },
        { type: "video", size: "16MB" },
        { type: "audio", size: "8MB" },
        { type: "blob", size: "8MB" },
        { type: "pdf", size: "4MB" },
        { type: "text", size: "64kB" },
    ];

    return (
        <>
            <section className="container mx-auto w-full h-full flex flex-col justify-between md:flex-row gap-10 pt-4">
                <div className="border-4 border-[#56A2E8] rounded-4xl md:w-1/2 h-1/2 md:h-1/1 p-8 flex flex-col">
                    <div className="text-4xl">
                        Upload a file
                        <br />
                        Get a unique link
                        <br />
                        And share it
                        <br />
                        No sign-up needed.
                        <br />
                        Secure, temporary, and hassle-free.
                    </div>
                    <div>
                        Instructions:
                        <div className="max-w-md mx-auto mt-10 rounded-lg overflow-hidden border border-gray-700">
                            <table className="w-full text-left text-sm text-white bg-[#1e1e1e]">
                                <thead className="bg-[#2a2a2a] border-b border-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            File Type
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Default Max Size
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
                                            <td className="px-4 py-2">
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
                <div className="border-4 border-[#56A2E8] rounded-4xl md:w-3/8 h-1/2 md:h-1/1 p-8">
                    2
                </div>
            </section>
        </>
    );
}

export default Hero;
