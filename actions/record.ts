"use server";

import { DNSRecord } from "@/api";
import { fetchAPI } from "@/api";
import { auth } from "@/auth";
import { VALID_DOMAIN_REGEX } from "@/regex";

const checkError = new Error("Check error!");
const internalError = new Error("Internal API returned error!");

const check = async (record: { name: DNSRecord["name"] }) => {
    if(!record.name.match(VALID_DOMAIN_REGEX)) return false;
    const session = await auth();
    if(!session || !session.user || !session.user.email) return false;
    const base = record.name.split(".").slice(-2).join(".");
    if(!(record.name === base || record.name.endsWith("." + base))
        || record.name === "-." + base) return false;
    const ownerRecord = await (await fetchAPI(`/resolve/-.${base}`)).json() as DNSRecord[];
    if(ownerRecord.length === 0 || session.user.email !== ownerRecord[0].value) return false;
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
export async function deleteRecord(record: { id: DNSRecord["id"], name: DNSRecord["name"] }) {
    if(!await check(record)) throw checkError;
    const f = await fetchAPI(`/records/${record.id}`, {
        method: "DELETE"
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
