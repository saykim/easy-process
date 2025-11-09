import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Food Process Designer",
  description: "Design and manage food manufacturing process diagrams with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
