import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import StoreInitializer from "@/components/StoreInitializer";
import { Toaster } from "react-hot-toast";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "StayDrippy",
  description: "A complete e-commerce website with Next.js and Strapi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} font-sans antialiased`}>
        <AuthProvider>
          <StoreInitializer />
          <Navbar />
          <Toaster position="top-center" reverseOrder={true} />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
