import { DNSRecord, fetchAPI } from "@/api";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth();
    if(!session || !session.user || !session.user.email) return redirect("/");

    const f = await fetchAPI(`/owner/${session.user.email}`);
    const domains = (await f.json() as DNSRecord[]).map(x => x.name.replace(/^-\./, ""));

    return <>
        <h1>Your dashboard</h1>
        {domains.map(x => <Link className="row" key={x} href={`/dashboard/${x}`}>{x}</Link>)}
    </>
}