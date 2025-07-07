"use client";

import { Suspense } from "react";
import DownloadPageContent from "@/component/DownloadPageContent";

export default function DownloadPage() {
    return (
        <Suspense>
            <DownloadPageContent />
        </Suspense>
    );
}