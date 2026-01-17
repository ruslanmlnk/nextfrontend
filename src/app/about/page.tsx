import AboutPage from "@/components/AboutPage";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Про нас — Ostriv",
  description:
    "Ostriv — це каталог побутових товарів для дому. Дізнайтеся більше про нашу команду, підхід до якості та принципи роботи.",
};


export default function About() {
  return <AboutPage />;
}
