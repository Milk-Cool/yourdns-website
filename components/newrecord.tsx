"use client";
import { createRecord } from "@/actions/record";
import { DNSRecordType } from "@/api";
import { useState } from "react";

export default function NewRecord({ base }: { base: string }) {
    const [name, setName] = useState("");
    const [ttl, setTTL] = useState("300");
    const [type, setType] = useState("");
    const [value, setValue] = useState("");

    const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");

    return <div className="row"><form className="record" onSubmit={async e => {
        const form = new FormData(e.currentTarget);
        e.preventDefault();
        if(Number.isNaN(parseInt(form.get("ttl").toString()))) return setStatus("error");
        setStatus("saving");
        const name = form.get("name").toString();
        const type = form.get("type").toString() as DNSRecordType;
        const value = form.get("value").toString();
        try { await createRecord({
            name: name === "@" ? base : `${name}.${base}`,
            ttl: parseInt(form.get("ttl").toString()),
            type,
            value: type === "CNAME" && value === "@" ? base : value
        }); } catch(e) {
            alert(e.message);
            setStatus("error"); return;
        }
        setStatus("saved");
        location.reload();
    }}>
        <span>name = </span><input name="name" value={name} onChange={e => setName(e.target.value)} />;&nbsp;
        <span>ttl = </span><input name="ttl" type="number" className="input-ttl" value={ttl} onChange={e => setTTL(e.target.value)} />;&nbsp;
        <span>type = </span><select name="type" value={type} onChange={e => setType(e.target.value as DNSRecordType)}>
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="CNAME">CNAME</option>
            <option value="TXT">TXT</option>
        </select>;&nbsp;
        <span>value = </span><input name="value" value={value} onChange={e => setValue(e.target.value as DNSRecordType)} />;&nbsp;
        <input type="submit" disabled={status === "saving"} value={status === "saving" ? "saving" : status === "error" ? "error!" : "save"} />
    </form></div>;
};