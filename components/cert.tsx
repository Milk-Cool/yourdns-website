"use client";
import { generateCert } from "@/actions/cert";
import { CertPair } from "@/api";
import { useState } from "react";
import HexDownload from "./hexdownload";

export default function Cert({ certPair }: { certPair: CertPair }) {
    const [status, setStatus] = useState<"generated" | "generating" | "error">("generated");

    return <div className="row">
        <span>{certPair.domain}</span>&nbsp;
        <span>expires on {new Date(parseInt(certPair.until)).toLocaleDateString()}</span>&nbsp;
        <button onClick={async e => {
            e.preventDefault();
            setStatus("generating");
            try { await generateCert({
                name: certPair.domain
            }); } catch(e) {
                alert(e.message);
                setStatus("error"); return;
            }
            setStatus("generated");
            location.reload();
        }}>{status === "generated" ? "regenerate" : status === "generating" ? "generating" : "error"}</button>
        <HexDownload filename={certPair.domain + ".cert.der"} hex={certPair.cert}>download certificate</HexDownload>
        <HexDownload filename={certPair.domain + ".key.der"} hex={certPair.key}>download private key</HexDownload>
    </div>;
};