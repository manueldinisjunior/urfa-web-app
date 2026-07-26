import React from 'react';
import { Accordion } from '@/components/ui/accordion';

const FAQPage = () => {
  const faqs = [
    {
      question: "What is the return policy?",
      answer: "Our return policy allows for returns within 30 days of purchase, provided the items are in their original condition."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we offer international shipping to select countries. Please check our shipping policy for more details."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can contact our customer support via the contact form on our website or by emailing support@example.com."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit cards, PayPal, and Apple Pay."
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <Accordion items={faqs} />
    </div>
  );
};

export default FAQPage;