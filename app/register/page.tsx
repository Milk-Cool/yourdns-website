import NewDomain from "@/components/newdomain";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "yourdns | register new domain",
    description: "you can register a new domain on this page!"
};

export default function Page() {
    return <>
        <h1>Register new domain</h1>
        <NewDomain />
    </>;
}