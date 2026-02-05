import type { Metadata } from "next";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Interactive Check-in Form",
  description: "Interactive Check-in Form for Talio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="size-full">{children}</body>
    </html>
  );
}
