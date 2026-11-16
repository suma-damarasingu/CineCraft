import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCw, Image as ImageIcon, Download, Columns, Smartphone, LayoutPanelLeft, Calendar, FileText, MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import ScriptEditor from '../components/script/ScriptEditor';
import StoryboardPanel from '../components/storyboard/StoryboardPanel';
import ScheduleBoard from '../components/schedule/ScheduleBoard';
import ScriptChat from '../components/chat/ScriptChat';

import { useParams } from 'react-router-dom';

const ScriptWorkspace = () => {
    const { id } = useParams();
    const [scriptData, setScriptData] = useState(null);
    const [currentScript, setCurrentScript] = useState('');
    const [storyboard, setStoryboard] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);

    // Layout State
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [activeTab, setActiveTab] = useState('storyboard'); // 'storyboard' | 'schedule' | 'chat'

    const pollInterval = useRef(null);

    const fetchScript = async (silent = false) => {
        try {
            const res = await fetch(`http://localhost:3004/api/scripts/${id}`);
            if (!res.ok) throw new Error("Script not found");
            const data = await res.json();

            // If polling (silent update), primarily update storyboard
            if (silent) {
                setScriptData(prev => ({ ...prev, storyboard: data.storyboard }));
                setStoryboard(data.storyboard || []);
            } else {
                setScriptData(data);
                setCurrentScript(data.script || '');
                setStoryboard(data.storyboard || []);
            }
            return data;
        } catch (err) {
            console.error(err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    // Initial Fetch
    useEffect(() => {
        if (id) {
            fetchScript();
        }
        return () => stopPolling();
    }, [id]);

    // Polling Logic
    useEffect(() => {
        if (isPolling) {
            pollInterval.current = setInterval(() => {
                fetchScript(true);
            }, 4000);
        } else {
            stopPolling();
        }
        return () => stopPolling();
    }, [isPolling]);

    const stopPolling = () => {
        if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
        }
    };

    const handleGenerateStoryboard = async () => {
        try {
            setIsPolling(true);
            setShowRightPanel(true);
            setActiveTab('storyboard');

            const res = await fetch(`http://localhost:3004/api/scripts/${id}/storyboard`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error("Failed to start generation");

            // Auto-stop polling after 2 minutes just in case
            setTimeout(() => setIsPolling(false), 120000);

        } catch (err) {
            console.error("Storyboard error", err);
            alert("Failed to start storyboard generation");
            setIsPolling(false);
        }
    };

    const handleSave = async () => {
        try {
            await fetch(`http://localhost:3004/api/scripts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    script: currentScript,
                })
            });
        } catch (err) {
            console.error("Save Error", err);
            alert("Failed to save script");
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-[50vh] animate-pulse text-muted">Loading Script...</div>;
    }

    if (!scriptData) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-muted">
                <p>Script not found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] pb-4 overflow-hidden">

            {/* Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-none mb-4 mx-4 bg-surface/90 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center justify-between shadow-xl z-20"
            >
                <div className="flex items-center gap-4 px-2">
                    <h2 className="text-sm font-bold text-primary px-3 border-r border-white/10 uppercase tracking-wider">
                        {scriptData.genre || 'Script'}
                    </h2>
                    <span className="text-xs text-muted truncate max-w-[200px] hidden md:block">
                        {scriptData.storyLine}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" title="Save Draft" onClick={handleSave}>
                        <Save size={16} />
                        <span className="hidden sm:inline ml-2">Save</span>
                    </Button>
                    <div className="w-px h-6 bg-white/10 mx-1" />

                    {/* View Toggles */}
                    <div className="flex bg-black/20 p-1 rounded-lg border border-white/5">
                        <button
                            onClick={() => { setShowRightPanel(true); setActiveTab('storyboard'); }}
                            className={`p-2 rounded md:px-3 text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'storyboard' && showRightPanel ? 'bg-primary text-background shadow' : 'text-muted hover:text-white'}`}
                        >
                            <ImageIcon size={14} /> Storyboard
                        </button>
                        <button
                            onClick={() => { setShowRightPanel(true); setActiveTab('schedule'); }}
                            className={`p-2 rounded md:px-3 text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'schedule' && showRightPanel ? 'bg-primary text-background shadow' : 'text-muted hover:text-white'}`}
                        >
                            <Calendar size={14} /> Schedule
                        </button>
                        <button
                            onClick={() => { setShowRightPanel(true); setActiveTab('chat'); }}
                            className={`p-2 rounded md:px-3 text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'chat' && showRightPanel ? 'bg-primary text-background shadow' : 'text-muted hover:text-white'}`}
                        >
                            <MessageSquare size={14} /> Assistant
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Split View */}
            <div className="flex-1 flex overflow-hidden px-4 gap-4">

                {/* Script Editor (Left) */}
                <motion.div
                    layout
                    className={`h-full overflow-y-auto bg-surface/30 rounded-lg border border-white/5 scrollbar-hide ${showRightPanel ? 'w-1/2' : 'w-full max-w-4xl mx-auto'}`}
                >
                    <div className="p-8 min-h-full">
                        <ScriptEditor
                            initialScript={currentScript}
                            onScriptChange={setCurrentScript}
                        />
                    </div>
                </motion.div>

                {/* Right Panel (Multi-Tab) */}
                <motion.div
                    layout
                    initial={{ opacity: 0, x: 50 }}
                    animate={{
                        opacity: showRightPanel ? 1 : 0,
                        width: showRightPanel ? '50%' : '0%',
                        x: showRightPanel ? 0 : 50
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="h-full bg-zinc-900/50 rounded-lg border border-white/5 overflow-hidden flex flex-col"
                >
                    {showRightPanel && (
                        <div className="h-full flex flex-col">
                            {/* Panel Header */}
                            <div className="flex-none p-2 border-b border-white/5 flex gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted px-2 py-1">
                                    {activeTab === 'storyboard' && 'Visuals'}
                                    {activeTab === 'schedule' && 'Production'}
                                    {activeTab === 'chat' && 'AI Assistant'}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-hidden relative">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'storyboard' && (
                                        <motion.div
                                            key="storyboard"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0"
                                        >
                                            <StoryboardPanel
                                                storyboard={storyboard}
                                                isLoading={isPolling}
                                                onGenerate={handleGenerateStoryboard}
                                            />
                                        </motion.div>
                                    )}

                                    {activeTab === 'schedule' && (
                                        <motion.div
                                            key="schedule"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0"
                                        >
                                            <ScheduleBoard scriptId={id} />
                                        </motion.div>
                                    )}

                                    {activeTab === 'chat' && (
                                        <motion.div
                                            key="chat"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0"
                                        >
                                            <ScriptChat scriptId={id} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
};

export default ScriptWorkspace;
