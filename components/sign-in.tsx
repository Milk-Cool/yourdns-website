import { signIn } from "@/auth";
 
export default function SignIn() {
    return (
        <a onClick={async () => {
            "use server"
            await signIn("google")
        }} href="javascript:void(0)">Sign in</a>
    );
} ;