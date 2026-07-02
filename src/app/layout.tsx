import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { SupabaseProvider } from "@/providers/supabase-provider";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`
  },
  description: SITE.description,
  keywords: [
    "tech news",
    "developer news",
    "AI news",
    "programming",
    "GitHub trending",
    "Hacker News",
    "engineering blogs",
    "open source"
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
  width: "device-width",
  initialScale: 1
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SupabaseProvider initialSession={session}>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <div className="flex flex-1">
                <Sidebar />
                <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
              </div>
              <Footer />
            </div>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
