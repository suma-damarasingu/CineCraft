import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Calendar, ChevronRight, Search, Trash2, Edit2, X, Check } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const MyScreenplays = () => {
    const [scripts, setScripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchScripts();
    }, []);

    const fetchScripts = async () => {
        try {
            const res = await fetch('http://localhost:3004/api/scripts');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setScripts(data);
            } else {
                console.error("API returned invalid data format:", data);
                setScripts([]);
            }
        } catch (error) {
            console.error("Failed to fetch library", error);
            setScripts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault(); // Prevent Link navigation
        if (!window.confirm("Are you sure you want to delete this screenplay?")) return;

        try {
            await fetch(`http://localhost:3004/api/scripts/${id}`, { method: 'DELETE' });
            setScripts(scripts.filter(s => s._id !== id));
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const startEditing = (e, script) => {
        e.preventDefault();
        setEditingId(script._id);
        const currentTitle = script.title || script.storyLine || "Untitled";
        setEditName(currentTitle);
    };

    const saveRename = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stop event bubbling
        if (!editName.trim()) return;

        try {
            const res = await fetch(`http://localhost:3004/api/scripts/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editName })
            });

            if (res.ok) {
                setScripts(scripts.map(s =>
                    s._id === editingId ? { ...s, title: editName } : s
                ));
                setEditingId(null);
            }
        } catch (error) {
            console.error("Rename failed", error);
        }
    };

    const cancelEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingId(null);
    };

    const filteredScripts = scripts.filter(script =>
        (script.title && script.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        script.storyLine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.genre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
            >
                <div>
                    <span className="text-primary text-sm font-medium tracking-widest uppercase mb-1 block">Your Portfolio</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-text">My Screenplays</h2>
                </div>

                <div className="relative w-full md:w-auto min-w-[300px]">
                    <Search className="absolute left-3 top-3 text-muted/50" size={18} />
                    <Input
                        placeholder="Search scripts..."
                        className="pl-10 bg-surface/50 border-white/10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-surface/30 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScripts.map((script, idx) => (
                        <motion.div
                            key={script._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link to={`/scripts/${script._id}`} className="group block h-full">
                                <div className="h-full bg-surface/30 hover:bg-surface/50 border border-white/5 hover:border-primary/30 rounded-xl p-6 transition-all duration-300 flex flex-col relative overflow-hidden group-hover:shadow-lg group-hover:shadow-primary/5">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <FileText size={60} />
                                    </div>

                                    <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider px-2 py-1 bg-primary/10 rounded-md">
                                            {script.genre || 'Draft'}
                                        </span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => startEditing(e, script)}
                                                className="p-1.5 hover:text-primary transition-colors bg-background/80 backdrop-blur-sm rounded-md border border-white/10"
                                                title="Rename"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, script._id)}
                                                className="p-1.5 hover:text-red-500 transition-colors bg-background/80 backdrop-blur-sm rounded-md border border-white/10"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {editingId === script._id ? (
                                        <div className="mb-3 relative z-20" onClick={e => e.preventDefault()}>
                                            <div className="flex gap-2 items-center">
                                                <Input
                                                    value={editName}
                                                    onChange={e => setEditName(e.target.value)}
                                                    className="h-8 text-sm"
                                                    autoFocus
                                                    onClick={e => e.stopPropagation()}
                                                />
                                                <Button size="icon" className="h-8 w-8 min-w-[32px] bg-green-600 hover:bg-green-700 p-0" onClick={saveRename}>
                                                    <Check size={14} />
                                                </Button>
                                                <Button size="icon" className="h-8 w-8 min-w-[32px] bg-red-600 hover:bg-red-700 p-0" onClick={cancelEdit}>
                                                    <X size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <h3 className="text-xl font-serif font-medium mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                            {script.title || (script.storyLine ? `"${script.storyLine.substring(0, 50)}..."` : 'Untitled Script')}
                                        </h3>
                                    )}

                                    <div className="mt-auto pt-4 flex items-center justify-between text-muted text-sm border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>{new Date(script.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-primary" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && filteredScripts.length === 0 && (
                <div className="text-center py-20 text-muted">
                    <p>No scripts found.</p>
                    <Link to="/create" className="text-primary hover:underline mt-2 inline-block">Create your first screenplay</Link>
                </div>
            )}
        </div>
    );
};

export default MyScreenplays;
