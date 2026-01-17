import CartPage from "@/components/CartPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Кошик — Ostriv",
  description:
    "Перегляньте обрані побутові товари, змініть кількість позицій та перейдіть до оформлення замовлення на Ostriv.",
};
export default function Cart() {
  return <CartPage />;
}
