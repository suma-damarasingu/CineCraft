import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldAlert, Sparkles, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

const CharacterWizard = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Role, 2: Traits, 3: Review
    const [loading, setLoading] = useState(false);

    // Form Data
    const [role, setRole] = useState('protagonist'); // protagonist | antagonist
    const [rivalId, setRivalId] = useState('');
    const [name, setName] = useState('');

    // AI Data
    const [generatedTraits, setGeneratedTraits] = useState(null);
    const [selectedTraits, setSelectedTraits] = useState({
        philosophy: '',
        style: '',
        tool: '',
        flaw: ''
    });

    // Existing Characters (for Rival selection)
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        // Fetch characters for Rival Dropdown
        const fetchChars = async () => {
            try {
                const res = await fetch('http://localhost:3004/api/characters');
                const data = await res.json();
                setCharacters(data);
            } catch (err) { console.error(err); }
        };
        fetchChars();
    }, []);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3004/api/characters/generate-traits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role,
                    oppositeCharacterId: role === 'antagonist' ? rivalId : null,
                    scriptContext: "Cinematic Thriller" // Placeholder or props
                })
            });
            const data = await res.json();
            setGeneratedTraits(data);
            setStep(2);
        } catch (err) {
            console.error(err);
            alert("Failed to generate traits");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3004/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    role,
                    rivalId: rivalId || null,
                    ...selectedTraits
                })
            });
            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert("Failed to save character");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950">
                    <div>
                        <h2 className="text-xl font-bold font-serif text-primary">Character Studio</h2>
                        <p className="text-xs text-muted mt-1 uppercase tracking-wider">
                            {role === 'antagonist' && rivalId ? 'Foil Mode: Activated' : 'Standard Mode'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-muted hover:text-white">✕</button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">

                    {/* STEP 1: ROLE & CONFIG */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Select Role</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${role === 'protagonist' ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-white/10 hover:border-white/30'}`}
                                        onClick={() => setRole('protagonist')}
                                    >
                                        <User size={24} className="mb-2" />
                                        <h3 className="font-bold">Protagonist</h3>
                                        <p className="text-xs opacity-70">The Hero. The driving force.</p>
                                    </div>
                                    <div
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${role === 'antagonist' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-surface border-white/10 hover:border-white/30'}`}
                                        onClick={() => setRole('antagonist')}
                                    >
                                        <ShieldAlert size={24} className="mb-2" />
                                        <h3 className="font-bold">Antagonist</h3>
                                        <p className="text-xs opacity-70">The Villain. The obstacle.</p>
                                    </div>
                                </div>
                            </div>

                            {role === 'antagonist' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 bg-red-500/5 p-4 rounded-lg border border-red-500/20"
                                >
                                    <label className="block text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                                        <Sparkles size={14} /> Contrast Engine (Foil Mode)
                                    </label>
                                    <p className="text-xs text-gray-400">Select the Hero this Villain opposes. AI will generate traits that specifically challenge them.</p>

                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
                                        value={rivalId}
                                        onChange={(e) => setRivalId(e.target.value)}
                                    >
                                        <option value="">-- Select a Hated Rival --</option>
                                        {characters
                                            .filter(c => c.role === 'protagonist')
                                            .map(c => <option key={c._id} value={c._id}>{c.name}</option>)
                                        }
                                    </select>
                                </motion.div>
                            )}

                            <div className="pt-4">
                                <label className="block text-sm font-bold text-gray-400 mb-2">Character Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-surface border border-white/10 rounded-lg p-3 focus:outline-none focus:border-primary"
                                    placeholder="e.g. Ellen Ripley"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: AI TRAIT SELECTION */}
                    {step === 2 && generatedTraits && (
                        <div className="space-y-8">
                            {['philosophies', 'styles', 'tools', 'flaws'].map((category) => (
                                <div key={category} className="space-y-3">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        {category === 'philosophies' && 'Core Philosophy'}
                                        {category === 'styles' && 'Visual Style'}
                                        {category === 'tools' && 'Weapon / Tool'}
                                        {category === 'flaws' && 'Fatal Flaw'}
                                        <span className="text-xs font-normal normal-case text-muted ml-auto">Select one</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(generatedTraits[category] || []).map((option, idx) => {
                                            const keyMap = { philosophies: 'philosophy', styles: 'style', tools: 'tool', flaws: 'flaw' };
                                            const stateKey = keyMap[category];
                                            const isSelected = selectedTraits[stateKey] === option;

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedTraits(prev => ({ ...prev, [stateKey]: option }))}
                                                    className={`
                                                        px-4 py-2 rounded-full text-sm border transition-all text-left
                                                        ${isSelected
                                                            ? 'bg-primary text-background border-primary font-bold shadow-lg shadow-primary/20'
                                                            : 'bg-surface border-white/10 text-gray-300 hover:border-primary/50'}
                                                    `}
                                                >
                                                    {option}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 3: REVIEW */}
                    {step === 3 && (
                        <div className="text-center space-y-6 py-6">
                            <div className="w-20 h-20 mx-auto bg-surface rounded-full flex items-center justify-center border border-white/10">
                                {role === 'protagonist' ? <User size={40} className="text-primary" /> : <ShieldAlert size={40} className="text-red-400" />}
                            </div>
                            <div>
                                <h3 className="text-3xl font-serif font-bold text-white mb-2">{name}</h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs font-bold uppercase tracking-wider text-muted">
                                    {role}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto bg-surface/30 p-6 rounded-xl border border-white/5">
                                <div>
                                    <span className="block text-xs text-muted uppercase tracking-wider mb-1">Philosophy</span>
                                    <p className="font-medium text-white">{selectedTraits.philosophy}</p>
                                </div>
                                <div>
                                    <span className="block text-xs text-muted uppercase tracking-wider mb-1">Weapon</span>
                                    <p className="font-medium text-white">{selectedTraits.tool}</p>
                                </div>
                                <div>
                                    <span className="block text-xs text-muted uppercase tracking-wider mb-1">Style</span>
                                    <p className="font-medium text-white">{selectedTraits.style}</p>
                                </div>
                                <div>
                                    <span className="block text-xs text-muted uppercase tracking-wider mb-1">Fatal Flaw</span>
                                    <p className="font-medium text-white">{selectedTraits.flaw}</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-white/10 bg-zinc-950 flex justify-between items-center">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="text-muted hover:text-white flex items-center gap-2">
                            <ArrowLeft size={16} /> Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step === 1 && (
                        <Button
                            disabled={!name}
                            onClick={handleGenerate}
                            className="bg-primary text-background"
                        >
                            {loading ? <Sparkles className="animate-spin" size={16} /> : <Sparkles size={16} />}
                            {loading ? 'Consulting Muse...' : 'Generate Traits'}
                        </Button>
                    )}

                    {step === 2 && (
                        <Button
                            disabled={!Object.values(selectedTraits).every(Boolean)}
                            onClick={() => setStep(3)}
                        >
                            Review Character <ChevronRight size={16} />
                        </Button>
                    )}

                    {step === 3 && (
                        <Button onClick={handleSave} className="bg-primary text-background">
                            {loading ? 'Saving...' : 'Confirm & Save'} <Check size={16} />
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CharacterWizard;
