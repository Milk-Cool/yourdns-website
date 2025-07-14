"use server";

import { DNSRecord } from "@/api";
import { fetchAPI } from "@/api";

export async function updateRecord(record: DNSRecord) {
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
    if(f.status < 200 && f.status > 399) throw new Error("Internal API returned error!");
}