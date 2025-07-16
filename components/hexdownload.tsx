"use client";

import { ReactNode } from "react";

export default function HexDownload({ hex, filename, children }: { hex: string, filename: string, children: ReactNode }) {
    const binary = hex.match(/.{1,2}/g).map(x => parseInt(x, 16));
    const u8a = Uint8Array.from(binary);
    const blob = new Blob([u8a.buffer], { type: "application/octet-stream" });
    
    return <button onClick={() => {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
            a.remove();
        }, 1000);
    }}>{children}</button>;
};