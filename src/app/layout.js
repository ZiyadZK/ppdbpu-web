import { Inter } from "next/font/google";
import "./globals.css";
import { jakarta } from "@/libs/fonts";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PPDB",
  description: "PPDB SMK Pekerjaan Umum Negeri Bandung",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}
