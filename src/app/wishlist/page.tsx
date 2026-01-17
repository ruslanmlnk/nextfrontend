import WishlistPage from "@/components/WishlistPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Обране — Ostriv",
  description:
    "Список обраних товарів на Ostriv.",
  robots: {
    index: false,
    follow: false,
  },
};


export default function Wishlist() {
  return <WishlistPage />;
}
