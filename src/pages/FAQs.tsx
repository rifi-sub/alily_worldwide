import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQs.css';

interface FAQData {
  question: string;
  answer: string[];
}

export const FAQs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQData[] = [
    {
      question: "What is FinDom?",
      answer: [
        "Financial domination (Findom) is a niche within adult power exchange dynamics where money is used as a form of control, submission, and expression of power.",
        "In this dynamic, a submissive (often called a 'paypig' or 'sub') consents to sending money, gifts, or financial tribute to a dominant (Findomme) as part of the interaction. The exchange is psychological as much as it is financial, rooted in control, attention, and emotional triggers rather than traditional services.",
        "It's important to understand that Findom is not 'easy money' or passive income. Building a successful presence requires strong boundaries, communication skills, consistency, and an understanding of human psychology and online dynamics.",
        "Ethical Findom is based on consent, clear limits, and mutual understanding. It is not about coercion, exploitation, or taking advantage of vulnerable individuals.",
        "For those interested in becoming a Findomme, this space requires effort, strategy, and personal discipline—much like any other online business or personal brand."
      ]
    },
    {
      question: "Who is Goddess A Lilly?",
      answer: [
        "Goddess A Lilly is the founder of the mentorship and a pioneer in the financial domination space. Her journey into the industry is rooted in a commitment to empowering others to build their dream lives remotely."
      ]
    },
    {
      question: "How does the mentorship work?",
      answer: [
        "The program combines one-on-one coaching sessions, strategic financial planning, and exclusive access to a high-performance community. We focus on building your remote lifestyle and achieving financial mastery."
      ]
    },
    {
      question: "Is the program suitable for beginners?",
      answer: [
        "Yes. The mentorship is truly bespoke, so is suitable for anybody at any stage of their FinDom journey. I provide the foundational knowledge and structure needed for anyone looking to transition into a remote lifestyle and dominate their financial future."
      ]
    },
    {
      question: "How can I book a 1-1 call?",
      answer: [
        "You can schedule a personalized coaching session directly through our 'Book Online' page. We recommend reaching out at least 48 hours in advance to secure your spot."
      ]
    }
  ];

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="faqs-page">
      <div className="container faqs-container">
        <h2 className="faqs-title">Questions</h2>
        
        <div className="faq-list">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => handleToggle(idx)}
              >
                <div className="faq-question-container">
                  <span className="faq-question">{faq.question}</span>
                  <ChevronDown className="faq-icon" size={20} />
                </div>
                
                <div className="faq-answer">
                  {faq.answer.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
