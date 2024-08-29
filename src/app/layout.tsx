import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToasterProvider } from "@/components/toaster-provider";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import Providers from "@/components/providers";


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
          {/* <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn> */}
        </header>
        <ToasterProvider/>
          {children}
      </body>
    </html>
    </Providers>
  </ClerkProvider>
  );
}
