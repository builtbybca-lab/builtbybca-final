import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const FAQ = () => {
  const faqs = [
    {
      category: "Admissions",
      questions: [
        {
          question: "What are the admission requirements for BCA?",
          answer: "Admission to BCA is competitive and based on academic performance, standardized test scores, recommendations, and demonstrated interest in STEM fields. Students must maintain high grades and show commitment to their chosen academy."
        },
        {
          question: "When is the application deadline?",
          answer: "Applications for the following school year are typically due in early December. We recommend checking our official website for the most current deadline information and application requirements."
        },
        {
          question: "Can students from outside Bergen County apply?",
          answer: "BCA primarily serves students from Bergen County, New Jersey. However, there may be limited opportunities for out-of-county students. Please contact our admissions office for specific eligibility requirements."
        }
      ]
    },
    {
      category: "Academics",
      questions: [
        {
          question: "What academies are available at BCA?",
          answer: "BCA offers multiple specialized academies including Academy for Technology & Computer Science (ATCS), Academy for Medical Science Technology, Academy for Engineering & Design Technology, and Academy for Culinary Arts & Hotel Administration."
        },
        {
          question: "Do students take regular high school courses?",
          answer: "Yes, students take all required high school courses alongside their specialized academy coursework. This ensures they receive a well-rounded education while developing expertise in their chosen field."
        },
        {
          question: "Are there research opportunities for students?",
          answer: "Absolutely! Students have access to cutting-edge research facilities and can participate in independent research projects, often in collaboration with local universities and industry partners."
        }
      ]
    },
    {
      category: "Student Life",
      questions: [
        {
          question: "What extracurricular activities are available?",
          answer: "BCA offers a wide range of clubs and activities including robotics teams, debate club, various honor societies, student government, and academy-specific organizations that align with students' interests and career goals."
        },
        {
          question: "Is there transportation to BCA?",
          answer: "Yes, BCA provides bus transportation from designated stops throughout Bergen County. Transportation schedules and routes are available through the school's transportation department."
        },
        {
          question: "What college preparation support is available?",
          answer: "Our guidance counselors provide comprehensive college counseling, including assistance with applications, essay writing, scholarship searches, and career planning. We also offer SAT/ACT prep and college visits."
        }
      ]
    },
    {
      category: "Technology & Resources",
      questions: [
        {
          question: "What technology resources are available to students?",
          answer: "Students have access to state-of-the-art computer labs, specialized software, 3D printers, robotics equipment, and industry-standard tools specific to their academy. Many resources are available for checkout and home use."
        },
        {
          question: "Do students need to bring their own devices?",
          answer: "While BCA provides extensive technology resources, students may benefit from having their own laptops for certain coursework. Specific requirements vary by academy and will be communicated during orientation."
        },
        {
          question: "Is there tech support available?",
          answer: "Yes, our IT department provides technical support for both school-provided and personal devices. Students can access help desk services during school hours and online resources 24/7."
        }
      ]
    },
    {
      category: "Career Preparation",
      questions: [
        {
          question: "Do students participate in internships?",
          answer: "Yes, many academies offer internship opportunities with local businesses, research institutions, and technology companies. These experiences provide real-world application of classroom learning."
        },
        {
          question: "What is the job placement rate for graduates?",
          answer: "Our graduates have an excellent track record, with over 95% going on to top universities or entering the workforce in their field of study. Many receive job offers or continue their education at prestigious institutions."
        },
        {
          question: "How does BCA prepare students for college?",
          answer: "Through rigorous coursework, research projects, presentations, and real-world applications, students develop critical thinking, problem-solving, and communication skills essential for college success."
        }
      ]
    },
    {
      category: "General Information",
      questions: [
        {
          question: "What makes BCA different from other high schools?",
          answer: "BCA combines rigorous academics with specialized, hands-on training in cutting-edge fields. Our small class sizes, industry partnerships, and state-of-the-art facilities create a unique learning environment."
        },
        {
          question: "How can parents stay involved?",
          answer: "Parents can join the Parent-Teacher Organization, attend academy-specific events, volunteer for school activities, and stay connected through our parent portal and regular communications."
        },
        {
          question: "What are the school hours?",
          answer: "School hours are typically 8:00 AM to 3:15 PM, Monday through Friday. Some academy-specific activities and labs may extend beyond regular hours, and students may have early morning or late afternoon sessions."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bca-dark">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Frequently Asked <span className="text-bca-red">Questions</span>
          </h1>
          <p className="text-xl text-bca-gray-light max-w-3xl mx-auto">
            Find answers to common questions about BCA programs, admissions, student life, and more.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-bca-red/30">
                {category.category}
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${categoryIndex}-${index}`}
                    className="bg-bca-dark-card/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left text-white hover:text-bca-red transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-bca-gray-light">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
          
          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-bca-red/10 to-bca-red/5 rounded-xl border border-bca-red/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h3>
            <p className="text-bca-gray-light mb-6">
              Can't find what you're looking for? Our admissions team is here to help with any additional questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-bca-red hover:bg-bca-red-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Us
              </a>
              <a
                href="mailto:BUILTBY.BCA@GMAIL.COM"
                className="border border-bca-red text-bca-red hover:bg-bca-red hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Email Directly
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;