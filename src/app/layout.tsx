import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Artifact Digital Archive",
  description: "Scan a QR code to explore museum artifacts.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
