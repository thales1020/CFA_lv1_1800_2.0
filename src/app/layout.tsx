import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CFA Level 1 Mock Exam - Prometric CBT Simulator",
  description: "Simulates Prometric CBT interface for CFA Level 1 practice exams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
