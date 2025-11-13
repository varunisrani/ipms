import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "IPMS - Integrated Patient Management System",
    template: "%s | IPMS",
  },
  description:
    "Integrated Patient Management System for managing patient photos securely and efficiently with AWS S3 storage tiers",
  keywords: [
    "patient management",
    "medical imaging",
    "photo management",
    "healthcare",
    "HIPAA compliant",
  ],
  authors: [{ name: "IPMS Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="flex min-h-screen flex-col font-sans antialiased"
      >
        <Header />
        <Navigation />
        <main className="flex-1 bg-zinc-50 dark:bg-black">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
