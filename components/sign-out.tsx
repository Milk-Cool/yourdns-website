import { signOut } from "@/auth";
 
export default function SignOut() {
    return (
        <a onClick={async () => {
            "use server"
            await signOut()
        }} href="javascript:void(0)">Sign out</a>
    );
} ;