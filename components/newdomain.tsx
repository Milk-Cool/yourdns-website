"use client";

import { createDomain } from "@/actions/register";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewDomain() {
    const [status, setStatus] = useState<"none" | "saving" | "error">("none");
    const [name, setName] = useState("");
    const router = useRouter();

    return (
        <form onSubmit={async e => {
            const form = new FormData(e.currentTarget);
            e.preventDefault();
            setStatus("saving");
            const name = form.get("name").toString();
            try { await createDomain({
                name
            }); } catch(e) {
                alert(e.message);
                setStatus("error"); return;
            }
            setStatus("none");
            router.push(`/dashboard/${name}`);
        }}>
            <span>name = </span><input name="name" value={name} onChange={e => setName(e.target.value)} />;&nbsp;
            <input type="submit" disabled={status === "saving"} value={status === "saving" ? "saving" : status === "error" ? "error!" : "save"} />
        </form>
    );
}