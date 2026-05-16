import type { Metadata } from "next";
import localFont from "next/font/local";
import { MSWProvider } from "./MSWProvider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NovaBank — Online Banking",
  description: "NovaBank reference banking application — built with Next.js 14",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="arctic-white">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  );
}
