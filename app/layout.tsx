export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link href="/style.css" rel="stylesheet" />
            </head>
            <body>{children}</body>
        </html>
    );
}