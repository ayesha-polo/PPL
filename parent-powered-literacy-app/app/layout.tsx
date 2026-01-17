// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header className="app-header">
          <nav className="app-nav">
            <strong className="app-title">Parent Powered Literacy</strong>

            <Link href="/dashboard">Dashboard</Link>
            <Link href="/lessons">Lessons</Link>
            <Link href="/discussion">Discussion</Link>
            <Link href="/certificate">Certificate</Link>
            <Link href="/help">Help</Link>
          </nav>
        </header>

        {/* Main content */}
        <main className="app-main">
          {children}
        </main>
      </body>
    </html>
  );
}
