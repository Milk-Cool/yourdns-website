import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google({
        authorization: {
            url: "https://accounts.google.com/o/oauth2/v2/auth",
            params: { scope: "openid email profile" },
        },
        token: { url: "https://oauth2.googleapis.com/token" },
        userinfo: { url: "https://openidconnect.googleapis.com/v1/userinfo" },
    })],
});