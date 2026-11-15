import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blueprint — Turn ideas into projects everyone understands",
  description:
    "Transform scattered client requirements into beautiful visual project plans. Organize features, connect workflows, collaborate, and get everyone on the same page.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#090909] text-white antialiased">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#141414",
              border: "1px solid #262626",
              color: "#ffffff",
            },
          }}
        />
      </body>
    </html>
  );
}
