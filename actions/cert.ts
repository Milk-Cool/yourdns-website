"use server";

import { CertPair, DNSRecord } from "@/api";
import { fetchAPI } from "@/api";
import { auth } from "@/auth";
import { VALID_DOMAIN_REGEX } from "@/regex";

const checkError = new Error("Check error!").message;
const intervalError = new Error("Certificates my only be renewed once every 24 hours!").message;
const internalError = new Error("Internal API returned error!").message;

const check = async (record: { name: DNSRecord["name"] }) => {
    if(!record.name.match(VALID_DOMAIN_REGEX)) return false;
    const session = await auth();
    if(!session || !session.user || !session.user.email) return false;
    const records = await (await fetchAPI(`/resolve/${record.name}`)).json() as DNSRecord[];
    if(records.length === 0) return false;
    const base = record.name.split(".").slice(-2).join(".");
    if(!(record.name === base || record.name.endsWith("." + base))
        || record.name === "-." + base) return false;
    const ownerRecord = await (await fetchAPI(`/resolve/-.${base}`)).json() as DNSRecord[];
    if(ownerRecord.length === 0 || session.user.email !== ownerRecord[0].value) return false;
    return true;
}

export async function generateCert(record: { name: DNSRecord["name"] }) {
    if(!(await check(record))) return { error: checkError };

    const f1 = await fetchAPI(`/cert/${record.name}`);
    if(f1.status !== 404) {
        if(f1.status < 200 || f1.status > 399) return { error: internalError };
        const cert = await f1.json() as CertPair;
        const diff = Date.now() - parseInt(cert.timestamp);
        if(diff < 24 * 3600 * 1000) return { error: intervalError };
    }

    const f2 = await fetchAPI(`/cert/${record.name}`, {
        method: "POST"
    });
    if(f2.status < 200 || f2.status > 399) return { error: internalError };
}
export async function getCA() {
    const f = await fetchAPI(`/ca`);
    if(f.status < 200 || f.status > 399) return { error: internalError };
    return await f.text();
}