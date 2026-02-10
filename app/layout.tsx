import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kapp Assessment - Admin Dashboard",
  description: "Organization admin analytics and management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
