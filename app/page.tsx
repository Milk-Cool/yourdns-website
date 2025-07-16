import { getCA } from "@/actions/cert";
import HexDownload from "@/components/hexdownload";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "yourdns",
    description: "yourdns is a free-to-use domain name provider and DNS server"
};

export default async function Page() {
    const ca = await getCA();
    return <>
        <h1>Hiiii!</h1>
        <HexDownload hex={ca} filename="yourdns-ca.der">download certificate authority</HexDownload>
    </>;
}