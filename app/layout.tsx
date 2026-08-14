import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ba-ole.vercel.app"),
  title: "雨林行程紀錄 · Swak Ali × Ba Ole",
  description: "2026 馬來西亞雨林行程、記帳與田野記錄 PWA。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "雨林行程紀錄 · Swak Ali × Ba Ole",
    description: "2026 砂拉越雨林行程、支出與田野記錄。",
    images: [{ url: "/og.png", width: 1728, height: 910, alt: "雨林行程紀錄" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "雨林行程紀錄 · Swak Ali × Ba Ole",
    description: "2026 砂拉越雨林行程、支出與田野記錄。",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#123b32",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
