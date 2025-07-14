"use client";
import { deleteRecord, updateRecord } from "@/actions/record";
import { DNSRecord, DNSRecordType } from "@/api";
import { useState } from "react";

export default function Record({ record }: { record: DNSRecord }) {
    const base = record.name.split(".").slice(-2).join(".");

    const [name, setName] = useState(record.name.split(".").slice(0, -2).join(".") || "@");
    const [ttl, setTTL] = useState(record.ttl.toString());
    const [type, setType] = useState(record.type);
    const [value, setValue] = useState(record.value);
    const { id } = record;

    const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");

    return <div className="row"><form className="record" onSubmit={async e => {
        const form = new FormData(e.currentTarget);
        e.preventDefault();
        if(Number.isNaN(parseInt(form.get("ttl").toString()))) return setStatus("error");
        setStatus("saving");
        const name = form.get("name").toString();
        const type = form.get("type").toString() as DNSRecordType;
        const value = form.get("value").toString();
        try { await updateRecord({
            id,
            name: name === "@" ? base : `${name}.${base}`,
            ttl: parseInt(form.get("ttl").toString()),
            type,
            value: type === "CNAME" && value === "@" ? base : value
        }); } catch(_) { setStatus("error"); return; }
        setStatus("saved");
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
    </form><button onClick={async () => {
        await deleteRecord({ id, name: record.name });
        location.reload();
    }}>delete</button></div>;
};