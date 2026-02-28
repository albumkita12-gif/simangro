import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SIMANGRO KKP – Sistem Informasi Mangrove",
  description: "Platform digital untuk informasi dan identifikasi jenis mangrove Indonesia. Dengan deskripsi lengkap, ciri morfologi, dan informasi penting berbagai spesies mangrove.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#059669" />
        <link rel="icon" type="image/png" href="/img/logo-KKP.png" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
