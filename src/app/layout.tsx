import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ClientProviders } from "@/components/ClientProviders";

const inter = localFont({
  src: "../../public/fonts/inter-variable.woff2",
  variable: "--font-inter",
});

const krasar = localFont({
  src: [
    { path: "../../public/fonts/Krasar-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Krasar-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Krasar-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-krasar",
});

export const metadata: Metadata = {
  title: "Management System",
  description: "Next.js management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${krasar.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <ClientProviders>
          <AppShell>{children}</AppShell>
        </ClientProviders>
      </body>
    </html>
  );
}
