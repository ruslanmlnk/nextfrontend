import DeliveryPage from "@/components/DeliveryPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Умови оплати та доставки — Ostriv",
  description:
    "Інформація про умови оплати та доставки побутових товарів на Ostriv. Доступні способи оплати, терміни та правила доставки.",
};
export default function Delivery() {
  return <DeliveryPage />;
}
