import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToasterProvider } from "@/components/toaster-provider";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import Providers from "@/components/providers";
import NavbarComponent from "@/components/navbar-component";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat APP",
  description: "Created by shiva",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
    <html lang="en">
      <body>
        <header>
        </header>
        <ToasterProvider/>
        {/* <div className="flex flex-col h-screen">
          <div className="sticky top-0 z-50 bg-gray-900 text-white border-gray-400">
            <NavbarComponent />
          </div>
          <div className="flex flex-col flex-grow bg-gray-100">
            
          </div>
        </div> */}

        {children}

      </body>
    </html>
    </Providers>
  </ClerkProvider>
  );
}
