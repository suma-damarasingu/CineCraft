import React, { useState, useEffect } from 'react';
import { PlusCircle, User, ShieldAlert } from 'lucide-react';
import CharacterWizard from '../components/characters/CharacterWizard';
import { motion } from 'framer-motion';

const CharacterStudio = () => {
    const [characters, setCharacters] = useState([]);
    const [showWizard, setShowWizard] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCharacters = async () => {
        try {
            const res = await fetch('http://localhost:3004/api/characters');
            const data = await res.json();
            setCharacters(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    return (
        <div className="container mx-auto px-6 py-10 max-w-7xl">
            <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Character Studio</h1>
                    <p className="text-muted text-lg">Detailed profiles, generated psyches, and AI-powered foils.</p>
                </div>
                <button
                    onClick={() => setShowWizard(true)}
                    className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20"
                >
                    <PlusCircle size={20} />
                    Create Character
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-xl"></div>)}
                </div>
            ) : characters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {characters.map((char) => (
                        <motion.div
                            key={char._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors group relative"
                        >
                            <div className={`h-2 w-full ${char.role === 'protagonist' ? 'bg-primary' : 'bg-red-500'}`} />

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-full ${char.role === 'protagonist' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                                        {char.role === 'protagonist' ? <User size={24} /> : <ShieldAlert size={24} />}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted bg-white/5 px-2 py-1 rounded">
                                        {char.role}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-serif font-bold mb-1">{char.name}</h3>
                                <p className="text-sm text-muted italic mb-6">"{char.philosophy}"</p>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-muted">Style</span>
                                        <span className="font-medium text-white/80">{char.style}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-muted">Tool</span>
                                        <span className="font-medium text-white/80">{char.tool}</span>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <span className="text-muted text-red-300/70">Flaw</span>
                                        <span className="font-medium text-red-300">{char.flaw}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <User size={48} className="mx-auto text-white/20 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Characters Yet</h3>
                    <p className="text-muted max-w-md mx-auto mb-6">Start building your cast. Create a hero, then let AI suggest the perfect villain to challenge them.</p>
                    <button
                        onClick={() => setShowWizard(true)}
                        className="text-primary font-bold hover:underline"
                    >
                        Open Creation Wizard
                    </button>
                </div>
            )}

            {showWizard && (
                <CharacterWizard
                    onClose={() => setShowWizard(false)}
                    onSuccess={fetchCharacters}
                />
            )}
        </div>
    );
};

export default CharacterStudio;
