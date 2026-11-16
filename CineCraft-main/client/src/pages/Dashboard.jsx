import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, FileText, Sparkles, Clock, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const [scriptCount, setScriptCount] = useState(0);
    const [recentScripts, setRecentScripts] = useState([]);
    const [characterCount, setCharacterCount] = useState(0);

    useEffect(() => {
        const fetchScriptsCount = async () => {
            try {
                const res = await fetch('http://localhost:3004/api/scripts/count');
                if (!res.ok) throw new Error(`Status: ${res.status}`);

                const data = await res.json();
                if (data.count !== undefined) {
                    setScriptCount(data.count);
                }
            } catch (err) {
                console.error("Dashboard Fetch Error while fetching scripts:", err);
            }
        };
        fetchScriptsCount();

        const fetchCharactersCount = async () => {
            try {
                const res = await fetch('http://localhost:3004/api/characters/count');
                if (!res.ok) throw new Error(`Status: ${res.status}`);

                const data = await res.json();
                if (data.count !== undefined) {
                    setCharacterCount(data.count);
                }
            } catch (err) {
                console.error("Dashboard Fetch Error while fetching characters:", err);
            }
        };
        fetchCharactersCount();

        const fetchRecentScripts = async () => {
            try {
                const res = await fetch('http://localhost:3004/api/scripts/recent');
                if (!res.ok) throw new Error(`Status: ${res.status}`);

                const data = await res.json();
                if (Array.isArray(data)) {
                    setRecentScripts(data);
                } else {
                    console.error("Dashboard: API returned invalid data", data);
                    setRecentScripts([]);
                }
            } catch (err) {
                console.error("Dashboard Fetch Error while fetching recent scripts:", err);
                setRecentScripts([]);
            }
        };
        fetchRecentScripts();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Welcome Header */}
                <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Welcome back, Writer.</h1>
                        <p className="text-muted">Ready to craft your next masterpiece?</p>
                    </div>
                    <Link to="/create">
                        <button className="hidden md:flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all">
                            <Plus size={18} />
                            New Project
                        </button>
                    </Link>
                </div>

                {/* Stats / Quick Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div variants={itemVariants} className="p-6 rounded-xl bg-surface/30 border border-white/5 flex flex-col justify-between h-40 group hover:border-primary/20 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                                <Sparkles size={24} />
                            </div>
                            <span className="text-2xl font-bold">{scriptCount}</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Total Scripts</h3>
                            <p className="text-sm text-muted">Across all genres</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="p-6 rounded-xl bg-surface/30 border border-white/5 flex flex-col justify-between h-40 group hover:border-primary/20 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                                <Clock size={24} />
                            </div>
                            <span className="text-2xl font-bold">12h</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Writing Time</h3>
                            <p className="text-sm text-muted">This week</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="p-6 rounded-xl bg-surface/30 border border-white/5 flex flex-col justify-between h-40 group hover:border-primary/20 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                                <Clock size={24} />
                            </div>
                            <span className="text-2xl font-bold">{characterCount}</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Total Characters</h3>
                            <p className="text-sm text-muted">Across all scripts</p>
                        </div>
                    </motion.div>

                    {/* <Link to="/create" className="block h-full">
                        <motion.div variants={itemVariants} className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-surface/30 border border-primary/20 flex flex-col justify-between h-40 hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-primary/20 text-primary rounded-lg">
                                    <Plus size={24} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary">Start New Script</h3>
                                <p className="text-sm text-white/60">Generate with AI</p>
                            </div>
                        </motion.div>
                    </Link> */}
                </div>

                {/* Recent Projects */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FileText size={20} className="text-primary" />
                            Recent Projects
                        </h2>
                        <Link to="/scripts" className="text-sm text-primary hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {recentScripts.length > 0 ? (
                            recentScripts.map((script) => (
                                <Link to={`/scripts/${script._id}`} key={script._id}>
                                    <div
                                        className="flex items-center justify-between p-4 rounded-lg bg-zinc-900 border border-white/10 hover:border-primary/50 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-primary">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-lg text-white">
                                                    {script.title || (script.storyLine ? `"${script.storyLine.substring(0, 25)}..."` : 'Untitled Script')}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                    <span className="uppercase tracking-wider font-semibold text-xs bg-white/5 px-2 py-0.5 rounded">
                                                        {script.genre || 'Draft'}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{script.createdAt ? new Date(script.createdAt).toLocaleDateString() : 'Just now'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                            <ChevronRight size={18} className="text-gray-400" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 bg-white/5 rounded-xl border border-white/5">
                                No scripts yet.
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
