import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Excel Printing Ajman | Custom Printing, Branding & Design",
    template: "%s | Excel Printing Ajman",
  },
  description:
    "Configure and order business cards, flyers, banners, stamps, packaging and more. Design, approve and pay online — printed and delivered in Ajman, UAE.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://excelprintajman.com"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
