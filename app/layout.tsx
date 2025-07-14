import { auth } from "@/auth";
import Header from "@/components/header";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link href="/style.css" rel="stylesheet" />
            </head>
            <body>
                <Header auth={await auth()}></Header>
                <div id="content">
                    {children}
                </div>
            </body>
        </html>
    );
}