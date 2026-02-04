import { useState } from "react";
import { Mail, MapPin, Send, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
const Contact = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon."
    });
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="min-h-screen bg-background">
    <Navigation />

    {/* Hero Section */}
    <section className="pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Get in <span className="text-bca-red">Touch</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions about BCA? Want to learn more about our programs? We'd love to hear from you.
        </p>
      </div>
    </section>

    {/* Contact Section */}
    <section className="pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Contact Form */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <Input type="text" name="name" value={formData.name} onChange={handleChange} required className="bg-background border-border text-foreground placeholder:text-muted-foreground" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} required className="bg-background border-border text-foreground placeholder:text-muted-foreground" placeholder="your.email@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <Input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="bg-background border-border text-foreground placeholder:text-muted-foreground" placeholder="What is this about?" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <Textarea name="message" value={formData.message} onChange={handleChange} required rows={6} className="bg-background border-border text-foreground placeholder:text-muted-foreground" placeholder="Tell us how we can help you..." />
              </div>

              <Button type="submit" className="w-full bg-bca-red hover:bg-bca-red-hover text-white">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">

            {/* Contact Details */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-bca-red/20 rounded-lg">
                    <Mail className="w-6 h-6 text-bca-red" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Email</h4>
                    <p className="text-muted-foreground">builtby.bca@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-bca-red/20 rounded-lg">
                    <MapPin className="w-6 h-6 text-bca-red" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Address</h4>
                    <p className="text-muted-foreground">
                      Adichunchanagiri Institute of Business Management<br />
                      Jyothinagara, Chikkamagaluru-577102
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">Office Hours</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="text-foreground">8:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-foreground">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-foreground">Closed</span>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-r from-bca-red/10 to-bca-red/5 rounded-xl border border-bca-red/20 p-8">
              <h3 className="text-xl font-bold text-foreground mb-3">Have Questions?</h3>
              <p className="text-muted-foreground mb-4">
                Check out our frequently asked questions page for quick answers to common inquiries.
              </p>
              <Button variant="outline" className="border-bca-red text-bca-red hover:bg-bca-red hover:text-white">
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>;
};
export default Contact;