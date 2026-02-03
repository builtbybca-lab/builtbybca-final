import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Privacy <span className="text-bca-red">Policy</span>
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

            <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
            <p className="text-muted-foreground mb-6">
              Bergen County Academies ("BCA," "we," "us," or "our") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you visit our website and use our services.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-foreground mb-3">Personal Information</h3>
            <p className="text-muted-foreground mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="text-muted-foreground mb-6 space-y-2">
              <li>• Register for programs or services</li>
              <li>• Fill out forms or applications</li>
              <li>• Contact us through our website</li>
              <li>• Subscribe to newsletters or updates</li>
              <li>• Participate in surveys or feedback forms</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3">Usage Information</h3>
            <p className="text-muted-foreground mb-6">
              We automatically collect certain information when you visit our website, including:
              IP address, browser type, operating system, referring URLs, pages viewed, and timestamps.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use collected information for various purposes:
            </p>
            <ul className="text-muted-foreground mb-6 space-y-2">
              <li>• To provide and maintain our services</li>
              <li>• To process applications and registrations</li>
              <li>• To communicate with you about programs and updates</li>
              <li>• To improve our website and services</li>
              <li>• To comply with legal obligations</li>
              <li>• To protect against fraud and unauthorized access</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">Information Sharing and Disclosure</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties except:
            </p>
            <ul className="text-muted-foreground mb-6 space-y-2">
              <li>• With your explicit consent</li>
              <li>• To comply with legal requirements</li>
              <li>• To protect our rights and safety</li>
              <li>• To trusted service providers who assist in our operations</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-6">
              We implement appropriate technical and organizational security measures to protect your
              personal information against unauthorized access, alteration, disclosure, or destruction.
              However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Student Privacy</h2>
            <p className="text-muted-foreground mb-6">
              BCA is committed to protecting student privacy in accordance with the Family Educational
              Rights and Privacy Act (FERPA) and other applicable laws. Student educational records are
              maintained confidentially and shared only as permitted by law.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground mb-6">
              Our website may use cookies and similar tracking technologies to enhance user experience,
              analyze website traffic, and improve our services. You can control cookie preferences
              through your browser settings.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="text-muted-foreground mb-6 space-y-2">
              <li>• Right to access your personal information</li>
              <li>• Right to correct inaccurate information</li>
              <li>• Right to delete your information</li>
              <li>• Right to restrict processing</li>
              <li>• Right to data portability</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Links</h2>
            <p className="text-muted-foreground mb-6">
              Our website may contain links to third-party sites. We are not responsible for the privacy
              practices or content of these external sites. We encourage you to review their privacy
              policies before providing any personal information.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground mb-6">
              As an educational institution serving minors, we take special care to protect the privacy
              of students under 18. We collect and use student information only as necessary for
              educational purposes and in compliance with applicable privacy laws.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us:
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

export default Privacy;