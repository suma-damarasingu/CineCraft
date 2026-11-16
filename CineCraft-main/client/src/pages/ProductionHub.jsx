import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductionHub = () => {
    const [scripts, setScripts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const res = await fetch('http://localhost:3004/api/scripts');
                const data = await res.json();
                setScripts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchScripts();
    }, []);

    return (
        <div className="container mx-auto px-6 py-10 max-w-7xl">
            <div className="mb-10 border-b border-white/10 pb-6">
                <h1 className="text-4xl font-serif font-bold mb-2 flex items-center gap-3">
                    <Calendar className="text-primary" size={32} />
                    Production Schedules
                </h1>
                <p className="text-muted text-lg">Manage shooting schedules, breakdowns, and stripboards for your projects.</p>
            </div>

            {loading ? (
                <div className="text-muted">Loading Projects...</div>
            ) : scripts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scripts.map((script) => (
                        <motion.div
                            key={script._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-lg text-primary">
                                    <FileText size={24} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-muted bg-white/5 px-2 py-1 rounded">
                                    {script.genre}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{script.storyLine ? script.storyLine.substring(0, 30) + "..." : "Untitled Script"}</h3>
                            <p className="text-sm text-muted mb-6 line-clamp-2">{script.storyLine}</p>

                            <Link
                                to={`/scripts/${script._id}`}
                                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full justify-center transition-all"
                            >
                                Open Schedule <ArrowRight size={14} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-muted">No scripts found. Create a project first.</p>
                </div>
            )}
        </div>
    );
};

export default ProductionHub;
