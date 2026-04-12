import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import HomeHeader from "@/components/header/HomeHeader";
import HomeFooter from "@/components/footer/HomeFooter";
import { AuthProvider } from "@/context/auth.context";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineTix - Book Your Favorite Movies",
  description: "The ultimate movie ticketing experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {/* Toaster is a config component, it does not take children */}
          <Toaster position="top-right" richColors closeButton />
          
          <HomeHeader />
          
          {/* Main content grows to fill space, pushing footer down */}
          <main className="grow">
            {children}
          </main>
          
          <HomeFooter />
        </AuthProvider>
      </body>
    </html>
  );
}