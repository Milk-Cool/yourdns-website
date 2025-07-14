import { DNSRecord } from "@/api";

export default function Record({ record }: { record: DNSRecord }) {
    return <p>{record.name}</p>;
} ;