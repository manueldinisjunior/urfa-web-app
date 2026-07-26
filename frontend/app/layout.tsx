import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Urfa Grill Hildesheim",
  description: "Modern Turkish fast-food ordering for Urfa Grill Hildesheim."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <div className="page-gradient" />
        {children}
      </body>
    </html>
  );
}
