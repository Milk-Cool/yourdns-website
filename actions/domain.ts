"use server";

import { DNSRecord } from "@/api";
import { fetchAPI } from "@/api";
import { auth } from "@/auth";
import { VALID_DOMAIN_REGEX } from "@/regex";

const checkError = new Error("Check error!");
const internalError = new Error("Internal API returned error!");

const check = async (name: DNSRecord["name"]) => {
    if(!name.match(VALID_DOMAIN_REGEX)) return false;
    const session = await auth();
    if(!session || !session.user || !session.user.email) return false;
    if(name.split(".").length !== 2) return false;
    const ownerRecord = await (await fetchAPI(`/resolve/-.${name}`)).json() as DNSRecord[];
    if(ownerRecord.length === 0 || session.user.email !== ownerRecord[0].value) return false;
    return ownerRecord;
}

export async function deleteDomain(name: DNSRecord["name"]) {
    if(await check(name) === false) throw checkError;
    const f = await fetchAPI(`/delete/${name}`, {
        method: "POST"
    });
    if(f.status < 200 && f.status > 399) throw internalError;
}

export async function transferDomain(name: DNSRecord["name"], owner: string) {
    const ownerRecord = await check(name);
    if(ownerRecord === false) throw checkError;
    console.log(ownerRecord);
    const f = await fetchAPI(`/records/${ownerRecord[0].id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            name: ownerRecord[0].name,
            ttl: ownerRecord[0].ttl,
            type: ownerRecord[0].type,
            value: owner
        } as Omit<DNSRecord, "id">)
    });
    if(f.status < 200 && f.status > 399) throw internalError;
}
