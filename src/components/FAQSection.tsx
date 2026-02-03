import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I join Builtby.BCA ?",
      answer: "You can join Builtby.BCA by filling out our membership form. Submit the enrollment form, attend an orientation session, and you'll be part of our community!"
    },
    {
      question: "FAQs for Students",
      answer: "We provide comprehensive support for students including mentorship programs, technical workshops, career guidance, and networking opportunities with industry professionals."
    },
    {
      question: "What's the membership fee?",
      answer: "Membership is completely free for all BCA students. We believe in making quality education and opportunities accessible to everyone."
    },
    {
      question: "Can I participate without being a member?",
      answer: "While some events are open to all students, becoming a member gives you access to exclusive workshops, mentorship programs, and priority registration for special events."
    },
    {
      question: "How are individual roles choosen?",
      answer: "Roles are assigned based on your interests, skills, and commitment level. We conduct interviews and assessments to match members with positions that suit their strengths and career goals."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-20 relative" id="contact">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">
            Stay Updated with Us
          </h2>

          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-bca-red transition-colors"
              />
              <Button className="btn-hero px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="card-glass overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-foreground font-semibold text-lg">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 ml-4">
                  {openFAQ === index ? (
                    <Minus className="w-5 h-5 text-bca-red" />
                  ) : (
                    <Plus className="w-5 h-5 text-bca-red" />
                  )}
                </div>
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;