import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  const socialLinks = [{
    icon: Facebook,
    href: "#",
    label: "Facebook"
  }, {
    icon: Twitter,
    href: "#",
    label: "Twitter"
  }, {
    icon: Instagram,
    href: "#",
    label: "Instagram"
  }, {
    icon: Linkedin,
    href: "#",
    label: "LinkedIn"
  }];
  const quickLinks = [{
    label: "About Us",
    href: "/about"
  }, {
    label: "Blog",
    href: "/blog"
  }, {
    label: "Resources",
    href: "/resources"
  }, {
    label: "Contact",
    href: "/contact"
  }];
  const supportLinks = [{
    label: "Privacy Policy",
    href: "/privacy"
  }, {
    label: "Terms & Conditions",
    href: "/terms"
  }];
  return <footer className="relative bg-card border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Brand Section */}
        <div className="lg:col-span-1 text-center sm:text-left">
          <div className="mb-6">
            <img src="/logo.png" alt="BCA Logo" className="w-auto " />
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Empowering students through hands-on learning, leadership, and industry exposure.
          </p>
          <div className="flex items-center justify-center sm:justify-start space-x-4">
            {socialLinks.map((social, index) => <a key={index} href={social.href} className="p-2 bg-accent rounded-lg hover:bg-bca-red transition-colors group" aria-label={social.label}>
              <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-white" />
            </a>)}
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center sm:text-left">
          <h3 className="text-foreground font-semibold mb-6">Explore</h3>
          <ul className="space-y-3">
            {quickLinks.map((link, index) => <li key={index}>
              <Link to={link.href} className="text-muted-foreground hover:text-bca-red transition-colors">
                {link.label}
              </Link>
            </li>)}
          </ul>
        </div>

        {/* Support Links */}
        <div className="text-center sm:text-left">
          <h3 className="text-foreground font-semibold mb-6">Show Support</h3>
          <ul className="space-y-3">
            {supportLinks.map((link, index) => <li key={index}>
              <Link to={link.href} className="text-muted-foreground hover:text-bca-red transition-colors">
                {link.label}
              </Link>
            </li>)}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-center sm:text-left">
          <h3 className="text-foreground font-semibold mb-6">Contact Us</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 justify-center sm:justify-start">
              <MapPin className="w-5 h-5 text-bca-red mt-1 flex-shrink-0" />
              <p className="text-muted-foreground">
                Adichunchanagiri Institute Of Business Management, Karnataka
              </p>
            </div>
            <div className="flex items-center space-x-3 justify-center sm:justify-start">
              <Mail className="w-5 h-5 text-bca-red flex-shrink-0" />
              <a href="mailto:builtby.bca@gmail.com" className="text-muted-foreground hover:text-bca-red transition-colors">
                builtby.bca@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border mt-12 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 BuiltBy.BCA. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with ❤️ by BCA Students
          </p>
        </div>
      </div>
    </div>
  </footer>;
};
export default Footer;