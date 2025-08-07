import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisionF1",
  description: "Web app of the VisionF1 project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "Formula1-Display-Regular, F1Year, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
