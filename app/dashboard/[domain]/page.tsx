import { DNSRecord, fetchAPI } from "@/api";
import { auth } from "@/auth";
import NewRecord from "@/components/newrecord";
import Record from "@/components/record";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ domain: string }> }) {
    const session = await auth();
    if(!session || !session.user || !session.user.email) return redirect("/"); // TODO: proper error messages

    const { domain } = await params;
    if(domain.split(".").length > 2) return redirect("/");

    const ownerRecords = await (await fetchAPI(`/resolve/-.${domain}`)).json() as DNSRecord[];
    if(!ownerRecords.find(owner => owner.type === "TXT" && owner.value === session.user.email)) return redirect("/");

    const f = await fetchAPI(`/records?base=${encodeURIComponent(domain)}`);
    const domains = (await f.json() as DNSRecord[]).filter(x => !x.name.match(/^-\./));

    return <>
        <h1>Domain management: {domain}</h1>
        <h3>New record</h3>
        <NewRecord />
        <h3>Manage records</h3>
        {domains.map(x => <Record key={x.name} record={x} />)}
    </>
}