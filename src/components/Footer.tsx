import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "Events", href: "#events" },
    { label: "Blogs", href: "#blogs" },
    { label: "Contact", href: "#contact" },
  ];

  const supportLinks = [
    { label: "FAQs", href: "#faq" },
    { label: "Help Center", href: "#help" },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
  ];

  return (
    <footer className="relative bg-bca-dark-card border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="text-3xl font-bold">
                <span className="text-white">@BUILTBY.</span>
                <span className="text-bca-red">BCA</span>
              </span>
            </div>
            <p className="text-bca-gray-light mb-6 leading-relaxed">
              Empowering students through hands-on learning, leadership, and industry exposure.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2 bg-bca-dark-lighter rounded-lg hover:bg-bca-red transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-bca-gray-light group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Explore</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-bca-gray-light hover:text-bca-red transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Show Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-bca-gray-light hover:text-bca-red transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-bca-red mt-1 flex-shrink-0" />
                <p className="text-bca-gray-light">
                  Adichunchanagiri Institute Of Business Management, Karnataka
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-bca-red flex-shrink-0" />
                <a
                  href="mailto:contact@builtbybca.com"
                  className="text-bca-gray-light hover:text-bca-red transition-colors"
                >
                  contact@builtbybca.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-bca-red flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-bca-gray-light hover:text-bca-red transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-bca-gray text-sm">
              © 2024 BuiltBy.BCA. All rights reserved.
            </p>
            <p className="text-bca-gray text-sm">
              Made with ❤️ by BCA Students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;