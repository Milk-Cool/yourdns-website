"use server";

import { DNSRecord } from "@/api";
import { fetchAPI } from "@/api";
import { auth } from "@/auth";

const checkError = new Error("Check error!");
const internalError = new Error("Internal API returned error!");

const check = async (record: DNSRecord | Omit<DNSRecord, "id">) => {
    const session = await auth();
    if(!session || !session.user || !session.user.email) return false;
    let baseRecord: DNSRecord;
    if("id" in record)
        baseRecord = await (await fetchAPI(`/records/${record.id}`)).json();
    else
        baseRecord = (await (await fetchAPI(`/resolve/${record.name.split(".").slice(-2).join(".")}`)).json())[0];
    if(!baseRecord) return false;
    if(!(record.name === baseRecord.name || record.name.endsWith("." + baseRecord.name))
        || record.name === "-." + baseRecord.name) return false;
    const ownerRecord = await (await fetchAPI(`/resolve/-.${baseRecord.name}`)).json() as DNSRecord[];
    if(session.user.email !== ownerRecord[0].value) return false;
    return true;
}

export async function updateRecord(record: DNSRecord) {
    if(!await check(record)) throw checkError;
    const f = await fetchAPI(`/records/${record.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            name: record.name,
            type: record.type,
            ttl: record.ttl,
            value: record.value
        })
    });
    if(f.status < 200 && f.status > 399) throw internalError;
}
export async function createRecord(record: Omit<DNSRecord, "id">) {
    if(!await check(record)) throw checkError;
    const f = await fetchAPI(`/records`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            name: record.name,
            type: record.type,
            ttl: record.ttl,
            value: record.value
        })
    });
    if(f.status < 200 && f.status > 399) throw internalError;
}
