import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import Navbar from "@/components/Navbar"; 
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

const lato = Lato({ 
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Vara | Curate Your Dream Wardrobe",
  description: "The digital sanctuary for South Asian luxury fashion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-sans bg-[#FFF8F0] text-gray-800 antialiased selection:bg-[#FB7185] selection:text-white`}>
        {/* Navbar is Global now */}
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        {children}
      </body>
    </html>
  );
}
