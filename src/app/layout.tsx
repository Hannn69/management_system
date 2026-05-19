import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { TopBar } from "@/components/TopBar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-y-scroll`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <ClientProviders>
          <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex flex-1 flex-col min-w-0 lg:ml-[280px]">
              <TopBar />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
