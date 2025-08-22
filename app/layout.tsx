import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shoply - Site de vente de produits",
  description: "Site de vente de produits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children
}
