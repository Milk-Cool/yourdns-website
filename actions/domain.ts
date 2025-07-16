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
    if(session.user.email !== ownerRecord[0].value) return false;
    return true;
}

export async function deleteDomain(name: DNSRecord["name"]) {
    if(!await check(name)) throw checkError;
    const f = await fetchAPI(`/delete/${name}`, {
        method: "POST"
    });
    if(f.status < 200 && f.status > 399) throw internalError;
}
