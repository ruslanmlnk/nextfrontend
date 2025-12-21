import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { fetchCategoriesServer } from "@/graphql/server/categories";
import "./globals.css";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const rubik = Rubik({
  variable: "--font-rubik",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ostriv Furniture",
  description: "Каталог меблів Ostriv на Next.js та Tailwind CSS.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await fetchCategoriesServer();

  return (
    <html lang="uk">
      <body className={`${rubik.variable} antialiased bg-white text-gray-900 font-sans`}>
        <Providers>
          <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header initialCategories={categories} />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
