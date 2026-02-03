import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Terms & <span className="text-bca-red">Conditions</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Last updated: March 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm rounded-xl border border-border p-8 md:p-12">
          <div className="prose prose-invert max-w-none dark:prose-invert">

            <h2 className="text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground mb-6">
              By accessing and using the Bergen County Academies ("BCA") website and services,
              you agree to be bound by these Terms and Conditions ("Terms"). If you disagree
              with any part of these terms, you may not access our website or use our services.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily access and use BCA's website for personal,
              non-commercial transitory viewing only. This license does not include:
            </p>
            <ul className="text-muted-foreground mb-6 space-y-2">
              <li>• Modifying or copying the materials</li>
              <li>• Using the materials for commercial purposes</li>
              <li>• Attempting to reverse engineer any software</li>
              <li>• Removing copyright or proprietary notations</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">Educational Services</h2>
            <p className="text-muted-foreground mb-6">
              BCA provides educational services and programs. Admission, enrollment, and
              participation in programs are subject to specific requirements, policies,
              and procedures that may be updated from time to time.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Student Conduct</h2>
            <p className="text-muted-foreground mb-4">
              Students and users of BCA services must:
            </p>
            <ul className="text-muted-foreground mb-6 space-y-2">
              <li>• Comply with all school policies and procedures</li>
              <li>• Respect the rights and dignity of others</li>
              <li>• Use technology resources responsibly</li>
              <li>• Maintain academic integrity</li>
              <li>• Follow all applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground mb-6">
              All content on the BCA website, including text, graphics, logos, images, and
              software, is the property of BCA or its content suppliers and is protected by
              copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">User Content</h2>
            <p className="text-muted-foreground mb-6">
              Users may submit content such as applications, assignments, or feedback. By
              submitting content, you grant BCA the right to use, modify, and distribute
              such content for educational and administrative purposes.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Privacy and Data Protection</h2>
            <p className="text-muted-foreground mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also
              governs your use of our website and services, to understand our practices
              regarding the collection and use of your information.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4">
              You may not use our website or services:
            </p>
            <ul className="text-muted-foreground mb-6 space-y-2">
              <li>• For any unlawful purpose or to solicit unlawful acts</li>
              <li>• To violate any international, federal, provincial, or state regulations or laws</li>
              <li>• To transmit malicious code, viruses, or harmful data</li>
              <li>• To harass, abuse, insult, harm, defame, or discriminate</li>
              <li>• To submit false or misleading information</li>
              <li>• To interfere with or circumvent security features</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">Disclaimers</h2>
            <p className="text-muted-foreground mb-6">
              The information on this website is provided on an "as is" basis. BCA makes no
              warranties, expressed or implied, and hereby disclaims all other warranties
              including, without limitation, implied warranties of merchantability, fitness
              for a particular purpose, or non-infringement of intellectual property.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground mb-6">
              In no event shall BCA or its suppliers be liable for any damages (including,
              without limitation, damages for loss of data or profit, or due to business
              interruption) arising out of the use or inability to use our website or services.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Indemnification</h2>
            <p className="text-muted-foreground mb-6">
              You agree to defend, indemnify, and hold harmless BCA from and against any
              claims, damages, obligations, losses, liabilities, costs, or debt arising
              from your use of our website or services.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Termination</h2>
            <p className="text-muted-foreground mb-6">
              We may terminate or suspend your account and access to our services immediately,
              without prior notice, for conduct that we believe violates these Terms or is
              harmful to other users, us, or third parties.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
            <p className="text-muted-foreground mb-6">
              These Terms shall be interpreted and governed by the laws of the State of
              New Jersey, without regard to its conflict of law provisions. Any legal
              action shall be conducted in the courts of Bergen County, New Jersey.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground mb-6">
              We reserve the right to modify or replace these Terms at any time. If a
              revision is material, we will provide at least 30 days notice prior to
              any new terms taking effect.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="text-muted-foreground">
              <p>Email: BUILTBY.BCA@GMAIL.COM</p>
              <p>Address: Bergen County Academies, 200 Hackensack Ave, Hackensack, NJ 07601</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;