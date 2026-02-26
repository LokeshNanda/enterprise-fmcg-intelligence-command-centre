import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enterprise FMCG Intelligence Command Centre",
  description: "Executive dashboard for FMCG conglomerate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
