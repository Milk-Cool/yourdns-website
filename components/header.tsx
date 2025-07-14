import { Session } from "next-auth";
import Link from "next/link";
import SignIn from "./sign-in";
import Spacer from "./spacer";
import SignOut from "./sign-out";

export default function Header({ auth }: { auth: Session }) {
    return <div id="header">
        <Link href="/"><b>yourdns!</b></Link><Spacer />|<Spacer />
        {auth?.user?.email ? <><Link href="/dashboard">Dashboard</Link><Spacer /><SignOut /></> : <SignIn />}
    </div>;
};