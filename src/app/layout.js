import { Inter } from "next/font/google";
import "./globals.css";
import { jakarta } from "@/libs/fonts";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PPDB",
  description: "PPDB SMK Pekerjaan Umum Negeri Bandung",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}
