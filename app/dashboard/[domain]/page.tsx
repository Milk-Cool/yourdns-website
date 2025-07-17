import { CertPair, DNSRecord, fetchAPI } from "@/api";
import { auth } from "@/auth";
import Cert from "@/components/cert";
import DeleteDomain from "@/components/deletedomain";
import NewCert from "@/components/newcert";
import NewRecord from "@/components/newrecord";
import Record from "@/components/record";
import TransferDomain from "@/components/transferdomain";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "yourdns | domain dasboard",
    description: "the domain management page"
};

export default async function Page({ params }: { params: Promise<{ domain: string }> }) {
    const session = await auth();
    if(!session || !session.user || !session.user.email) return redirect("/"); // TODO: proper error messages

    const { domain } = await params;
    if(domain.split(".").length > 2) return redirect("/");

    const ownerRecords = await (await fetchAPI(`/resolve/-.${domain}`)).json() as DNSRecord[];
    if(!ownerRecords.find(owner => owner.type === "TXT" && owner.value === session.user.email)) return redirect("/");

    const f = await fetchAPI(`/records?base=${encodeURIComponent(domain)}`);
    const domains = (await f.json() as DNSRecord[]).filter(x => !x.name.match(/^-\./));

    const f2 = await fetchAPI(`/certbase/${domain}`);
    const certs = (await f2.json() as CertPair[]);

    return <>
        <h1>Domain management: {domain}</h1>
        <h3>New record</h3>
        <NewRecord base={domain} />
        <h3>Manage records</h3>
        {domains.map(x => <Record key={x.id} record={x} />)}
        <h3>Issue certificate</h3>
        <NewCert />
        <h3>Manage certificates</h3>
        {certs.map(x => <Cert key={x.id} certPair={x} />)}
        <h5>To convert to PEM, run:</h5>
        <code>openssl x509 -inform der -in {domain}.cert.der -out {domain}.pem</code><br />
        <code>openssl rsa -inform der -in {domain}.key.der -out {domain}.key</code>
        <h3>Danger zone</h3>
        <DeleteDomain domain={domain} />
        <TransferDomain domain={domain} />
    </>
}