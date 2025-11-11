import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { DashboardLayout } from "@/components/layout/dashboard-layout.jsx";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Ask Your Councellor - Admin Dashboard",
  description: "Modern admin dashboard for educational counseling platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
        <DashboardLayout>
            {children}
        </DashboardLayout>
        </AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
              padding: '12px 20px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
