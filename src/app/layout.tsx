import ErrorBoundary from "@/components/ErrorBoundary";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout"
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Crowd Select",
  description: "A crowdsourced feedback platform for content creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <ErrorBoundary>
          <Layout>{children}</Layout>
        </ErrorBoundary>
      </body>
    </html>
  );
}