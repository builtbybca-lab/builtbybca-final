import { Code, Terminal, Users, Zap } from "lucide-react";
import { ScrollAnimate } from "@/hooks/useScrollAnimation";

const WhatWeDoSection = () => {
    const features = [
        {
            icon: <Terminal className="w-8 h-8 text-bca-red" />,
            title: "Workshops",
            description: "Hands-on sessions on the latest tech stacks and tools."
        },
        {
            icon: <Code className="w-8 h-8 text-bca-red" />,
            title: "Hackathons",
            description: "Intense coding competitions to solve real-world problems."
        },
        {
            icon: <Users className="w-8 h-8 text-bca-red" />,
            title: "Mentorship",
            description: "Guidance from seniors and industry experts."
        },
        {
            icon: <Zap className="w-8 h-8 text-bca-red" />,
            title: "Projects",
            description: "Collaborative building of open-source software."
        }
    ];

    return (
        <section className="py-24 bg-secondary/30 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollAnimate animation="fade" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-bca-red font-pixel tracking-widest text-sm uppercase">Our Activities</span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground font-serif">What We Do</h2>
                    <p className="text-muted-foreground text-lg">
                        We provide a platform for students to explore, experiment, and excel in the world of technology.
                    </p>
                </ScrollAnimate>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <ScrollAnimate
                            key={index}
                            animation="scale"
                            delay={0.1 * (index + 1)}
                            className="bg-card border border-border hover:border-border/80 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="mb-4 bg-secondary w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300 relative z-10">
                                <div className="text-bca-red transition-colors">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2 font-pixel tracking-wide relative z-10 transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed relative z-10 group-hover:text-foreground/80 transition-colors">
                                {feature.description}
                            </p>
                        </ScrollAnimate>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhatWeDoSection;
