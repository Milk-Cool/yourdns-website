"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteDomain } from "@/actions/domain";

export default function DeleteDomain({ domain }: { domain: string }) {
    const [status, setStatus] = useState<"idle" | "deleting" | "error">("idle");
    const router = useRouter();

    return <div className="row">delete domain: <button onClick={async e => {
        e.preventDefault();
        if(!confirm("are you sure?")) return;
        setStatus("deleting");
        const res = await deleteDomain(domain);
        if(typeof res === "object" && "error" in res) {
            alert(res.error);
            setStatus("error"); return;
        }
        setStatus("idle");
        router.push("/dashboard");
    }}>{status === "idle" ? "delete domain" : status === "deleting" ? "deleting" : "error"}</button></div>;
};