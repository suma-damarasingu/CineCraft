import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clapperboard, PenTool, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="relative isolate min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden">

            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <div className="container mx-auto px-4 text-center">

                {/* Entrance Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6">
                        <Sparkles size={14} />
                        <span>AI-Powered Filmmaking Suite</span>
                    </div>

                    {/* H1 Heading */}
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-text leading-tight tracking-tight">
                        From Storyline to <span className="text-primary italic">Screen</span>.
                    </h1>

                    {/* Subheading */}
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted font-light leading-relaxed">
                        Transform your raw story ideas into industry-standard scripts and generating director-controlled cinematic scene images.
                    </p>

                    {/* CTA Group */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                        <Button size="lg" className="w-full sm:w-auto group" onClick={() => navigate('/create')}>
                            Create Script
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                            View Example Gallery
                        </Button>
                    </div>

                    {/* Features Grid (Brief) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20 pt-10 border-t border-border/50">
                        <Feature
                            icon={<PenTool className="text-primary" />}
                            title="Screenplay Generator"
                            desc="Standard formatted scripts from simple prompts."
                        />
                        <Feature
                            icon={<ImageIcon className="text-primary" />}
                            title="Cinematic Stills"
                            desc="Generate scene-accurate visuals with AI."
                        />
                        <Feature
                            icon={<Clapperboard className="text-primary" />}
                            title="Director's Control"
                            desc="You choose the shot, lighting, and mood."
                        />
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

const Feature = ({ icon, title, desc }) => (
    <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
        <div className="p-3 rounded-full bg-surface mb-2 ring-1 ring-white/10">
            {icon}
        </div>
        <h3 className="font-serif text-lg font-medium text-text">{title}</h3>
        <p className="text-sm text-muted">{desc}</p>
    </div>
);

export default LandingPage;
