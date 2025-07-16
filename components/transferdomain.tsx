"use client";

import { transferDomain } from "@/actions/domain";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TransferDomain({ domain }: { domain: string }) {
    const [status, setStatus] = useState<"none" | "transferring" | "error">("none");
    const [owner, setOwner] = useState("");
    const router = useRouter();

    return <div className="row">
        <form onSubmit={async e => {
            const form = new FormData(e.currentTarget);
            const owner = form.get("owner").toString();
            if(!owner) {
                setStatus("error"); return;
            }
            e.preventDefault();
            if(!confirm("are you sure?\ntransfer to: " + owner)) return;
            setStatus("transferring");
            try { await transferDomain(domain, owner); } catch(e) {
                alert(e.message);
                setStatus("error"); return;
            }
            setStatus("none");
            router.push(`/dashboard`);
        }}>
            <span>transfer domain: </span>
            <span>owner email = </span><input type="email" name="owner" value={owner} onChange={e => setOwner(e.target.value)} />;&nbsp;
            <input type="submit" disabled={status === "transferring"} value={status === "transferring" ? "transferring" : status === "error" ? "error!" : "transfer"} />
        </form>
    </div>;
}