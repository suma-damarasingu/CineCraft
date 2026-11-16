import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Film, User, MapPin, Feather } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';

const CreateScriptPage = ({ setScriptData }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        storyLine: '',
        genre: '',
        tone: '',
        setting: '',
        characterName: '',
        characterTraits: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3004/api/generate-script', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate script');
            }

            // Persistence: Navigate to permanent URL
            if (data.scriptId) {
                navigate(`/scripts/${data.scriptId}`);
            } else {
                setScriptData({
                    ...formData,
                    script: data.script
                });
                navigate('/workspace');
            }

        } catch (error) {
            console.error("Generation Error:", error);
            alert("Failed to generate script. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 space-y-4"
            >
                <span className="text-primary text-sm font-medium tracking-widest uppercase border-b border-primary/20 pb-1">Pre-Production</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-text">Craft Your Screenplay</h2>
                <p className="text-muted max-w-xl mx-auto">
                    Provide the seed of your story. Our AI director will flesh out the scene, dialogue, and visual atmosphere.
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Main Story Input */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="group relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-xl"
                >
                    <div className="bg-background rounded-lg p-6 md:p-8 space-y-4 border border-white/5 group-focus-within:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 text-primary font-medium mb-1">
                            <Feather size={18} />
                            <label htmlFor="storyLine" className="cursor-pointer">Story Line <span className="text-red-500">*</span></label>
                        </div>
                        <Textarea
                            id="storyLine"
                            name="storyLine"
                            placeholder="A detective discovers a time machine in a smoky 1940s jazz club, but using it erases his memory of the woman he loves..."
                            value={formData.storyLine}
                            onChange={handleChange}
                            required
                            className="min-h-[120px] text-lg font-light md:text-xl bg-transparent border-0 focus-visible:ring-0 px-0 resize-none placeholder:text-muted/50"
                        />
                    </div>
                </motion.div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Genre & Tone */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4 p-6 rounded-xl bg-surface/30 border border-white/5">
                            <div className="flex items-center gap-2 text-muted font-medium">
                                <Film size={16} />
                                <h3>Atmosphere</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted/70">Genre</label>
                                <Input
                                    name="genre"
                                    placeholder="e.g. Neo-Noir, Sci-Fi..."
                                    value={formData.genre}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted/70">Tone / Mood</label>
                                <Input
                                    name="tone"
                                    placeholder="e.g. Gritty, Melancholic, Fast-paced"
                                    value={formData.tone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted/70">Setting</label>
                                <div className="relative">
                                    <MapPin size={14} className="absolute left-3 top-3 text-muted/50" />
                                    <Input
                                        name="setting"
                                        placeholder="e.g. London, 2049. Raining."
                                        className="pl-9"
                                        value={formData.setting}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Characters */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4 p-6 rounded-xl bg-surface/30 border border-white/5 h-full">
                            <div className="flex items-center gap-2 text-muted font-medium">
                                <User size={16} />
                                <h3>Protagonist Details</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted/70">Main Character Name</label>
                                <Input
                                    name="characterName"
                                    placeholder="e.g. Detective Miller"
                                    value={formData.characterName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted/70">Traits / Backstory</label>
                                <Textarea
                                    name="characterTraits"
                                    placeholder="Cynical, smokes too much, haunted by a cold case..."
                                    className="h-32 resize-none"
                                    value={formData.characterTraits}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* Action Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center pt-8"
                >
                    <Button
                        type="submit"
                        size="lg"
                        disabled={loading || !formData.storyLine.trim()}
                        className="min-w-[200px] text-lg bg-gradient-to-r from-primary to-[#D4AF37] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)] transition-all duration-500"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2 animate-pulse">
                                <Sparkles className="animate-spin" size={18} />
                                Writing Script...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Generate Screenplay
                                <ArrowRight size={18} />
                            </span>
                        )}
                    </Button>
                </motion.div>

            </form>
        </div>
    );
};

export default CreateScriptPage;
