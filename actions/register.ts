"use server";

import { fetchAPI, DNSRecord, TimestampedRecord } from "@/api";
import { auth } from "@/auth";
import { VALID_DOMAIN_REGEX } from "@/regex";
import { readFileSync } from "fs";

const invalidDomainError = new Error("Invalid domain!");
const takenError = new Error("This domain is taken!");
const unauthError = new Error("Unauthorized!");
const timeError = new Error("Please wait a full day before creating a new domain!");
const internalError = new Error("Internal API returned error!");

export async function createDomain(record: { name: DNSRecord["name"] }) {
    if(!record.name.match(VALID_DOMAIN_REGEX) || record.name.split(".").length !== 2) throw invalidDomainError;

    const tld = record.name.split(".").at(-1);
    const allowedTLDs = readFileSync("tlds.txt", "utf-8").split("\n").filter(x => x);
    if(!allowedTLDs.includes(tld)) throw invalidDomainError;

    const session = await auth();
    if(!session || !session.user || !session.user.email) throw unauthError;

    const f1 = await fetchAPI(`/resolve/-.${record.name}`);
    const resolved = await f1.json() as TimestampedRecord[];
    if(resolved.length > 0) throw takenError;

    const owned = await (await fetchAPI(`/owner/${session.user.email}`)).json() as TimestampedRecord[];
    if(owned.find(x => Date.now() - parseInt(x.timestamp) < 24 * 3600 * 1000)) throw timeError;

    const f2 = await fetchAPI(`/records`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            name: `-.${record.name}`,
            type: "TXT",
            ttl: 300,
            value: session.user.email
        })
    });
    if(f2.status < 200 && f2.status > 399) throw internalError;
}