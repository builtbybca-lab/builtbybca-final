import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AboutSection = () => {
    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-fade-up">
                        <div className="inline-flex items-center space-x-2 bg-card/60 border border-bca-red/30 rounded-full px-4 py-2">
                            <span className="text-bca-red font-pixel tracking-widest text-sm">WHO WE ARE</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-foreground font-serif">
                            Empowering the Next Generation of Tech Leaders
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            BuiltBy.BCA is more than just a club; it's a movement. We are a community of passionate developers, designers, and innovators coming together to learn, build, and grow.
                        </p>

                        <div className="pt-4">
                            <Button className="font-pixel bg-transparent border-2 border-bca-red text-foreground hover:bg-bca-red hover:text-white px-8 py-6 text-lg tracking-wider group transition-all">
                                Learn More
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
                        <div className="aspect-video rounded-2xl bg-card border border-border overflow-hidden shadow-2xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-bca-red/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-foreground/20 font-pixel text-6xl">BCA</span>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-bca-red/20 rounded-full blur-xl animate-float"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-bca-red/10 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
