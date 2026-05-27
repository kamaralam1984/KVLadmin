import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteProvider } from "@/contexts/SiteContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TenantProvider } from "@/contexts/TenantContext";

export const metadata: Metadata = {
  title: "KVL Central Admin System",
  description: "World-class centralized admin dashboard for scalable SaaS ecosystems",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <TenantProvider>
            <AuthProvider>
              <SiteProvider>{children}</SiteProvider>
            </AuthProvider>
          </TenantProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
