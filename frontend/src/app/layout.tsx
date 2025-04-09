import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthSessionProvider } from "./session-provider"; // ✅ Wraps next-auth SessionProvider
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlowStudio",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
