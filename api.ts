import { UUID } from "crypto";

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    if(!("headers" in options)) options.headers = {};
    options.headers["authorization"] = process.env.YOURDNS_KEY;
    return await fetch(new URL(endpoint, process.env.YOURDNS_API), options);
}

export type DNSRecordType = "A" | "AAAA" | "CNAME" | "TXT";

export type DNSRecord = {
    name: string;
    type: DNSRecordType;
    ttl: number;
    value: string;
};

export type DNSProxyRule = {
    id: UUID;
    rule: string;
    addr: string;
};
