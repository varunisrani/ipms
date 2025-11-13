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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IPMS",
  },
};

export const generateViewport = () => ({
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover" as const,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="flex min-h-screen flex-col font-sans antialiased overflow-x-hidden"
      >
        <div className="flex w-full flex-col">
          <Header />
          <Navigation />
        </div>
        <main className="flex-1 w-full bg-gray-50 dark:bg-zinc-950">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
