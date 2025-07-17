"use client";

import { generateCert } from "@/actions/cert";
import { useState } from "react";

export default function NewCert() {
    const [status, setStatus] = useState<"none" | "generating" | "error">("none");
    const [name, setName] = useState("");

    return (
        <div className="row"><form onSubmit={async e => {
            const form = new FormData(e.currentTarget);
            e.preventDefault();
            setStatus("generating");
            const name = form.get("name").toString();
            const res = await generateCert({
                name
            });
            if(typeof res === "object" && "error" in res) {
                alert(res.error);
                setStatus("error"); return;
            }
            setStatus("none");
            location.reload();
        }}>
            <span>name = </span><input name="name" value={name} onChange={e => setName(e.target.value)} />;&nbsp;
            <input type="submit" disabled={status === "generating"} value={status === "generating" ? "generating" : status === "error" ? "error!" : "save"} />
        </form></div>
    );
}