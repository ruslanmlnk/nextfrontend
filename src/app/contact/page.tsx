import ContactPage from '@/components/ContactPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Контакти — Ostriv",
  description:
    "Контактна інформація Ostriv. Зв’яжіться з нами для консультації, співпраці або запитань щодо побутових товарів.",
};

export default function Contact() {
  return <ContactPage />;
}

