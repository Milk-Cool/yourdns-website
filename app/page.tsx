import { getCA } from "@/actions/cert";
import HexDownload from "@/components/hexdownload";
import { readFileSync } from "fs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "yourdns",
    description: "yourdns is a free-to-use domain name provider and DNS server"
};

export default async function Page() {
    const ca = await getCA();
    const allowedTLDs = readFileSync("tlds.txt", "utf-8").split("\n").filter(x => x);
    return <>
        <h1>yourdns</h1>
        <h2>domains for the people!</h2>
        welcome to the yourdns homepage! yourdns is a domain name registrar and certificate authority made to provide free domains and TLS certificates – yes, just like freenom back in the good old days! it doesn't depend on any other companies, which is achieved by having our own CA certificate and DNS server (which still works with regular websites, by the way). this is especially useful for small personal projects and IoT projects.
        <h2>installation</h2>
        set one of the following as your DNS (pick whatever works on your system!) according to <a href="https://nordvpn.com/blog/how-to-change-dns/" target="_blank">these instructions</a>:
        <h3>DNS: {process.env.DNS_IP} | DoH: https://{process.env.DNS_DOH_HOST}</h3>
        then, if you want TLS support, install this certificate authority and install it (google the process for your device):<br />
        <HexDownload hex={ca} filename="yourdns-ca.der">download certificate authority</HexDownload>
        <h2>want your own domain?</h2>
        sign in with google and create your own domain in the dashboard! currently allowed TLDs are:
        <ul>
            {allowedTLDs.map(x => <li key={x}>.{x}</li>)}
        </ul>
    </>;
}