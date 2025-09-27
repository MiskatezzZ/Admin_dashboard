import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { DashboardLayout } from "@/components/layout/dashboard-layout.jsx";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Ask Your Councillor - Admin Dashboard",
  description: "Modern admin dashboard for educational counseling platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
