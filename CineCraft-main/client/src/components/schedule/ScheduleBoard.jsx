import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Calendar, Layers, MapPin, Clock, ArrowDownUp } from 'lucide-react';
import Button from '../ui/Button';

const ScheduleBoard = ({ scriptId }) => {
    const [scenes, setScenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOptimizing, setIsOptimizing] = useState(false);

    useEffect(() => {
        const fetchBreakdown = async () => {
            try {
                const res = await fetch(`http://localhost:3004/api/schedule/${scriptId}/schedule`);
                const data = await res.json();
                setScenes(data.scenes || []);
            } catch (err) {
                console.error("Failed to fetch breakdown", err);
            } finally {
                setLoading(false);
            }
        };

        if (scriptId) fetchBreakdown();
    }, [scriptId]);

    const handleOptimize = async () => {
        setIsOptimizing(true);
        try {
            const res = await fetch(`http://localhost:3004/api/schedule/${scriptId}/schedule/optimize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenes })
            });
            const data = await res.json();
            setScenes(data.optimizedScenes);
        } catch (err) {
            console.error("Optimization failed", err);
            alert("Failed to optimize schedule");
        } finally {
            setIsOptimizing(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted">Loading Breakdown...</div>;

    if (scenes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted">
                <Calendar size={48} className="mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">No Scenes Detected</h3>
                <p>Ensure your script has proper sluglines (e.g., INT. KITCHEN - DAY).</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-hidden flex flex-col bg-zinc-900/50">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-950/50">
                <div className="flex items-center gap-2">
                    <Layers size={20} className="text-primary" />
                    <h3 className="font-bold font-serif">Stripboard Breakdown</h3>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-muted">{scenes.length} Strips</span>
                </div>
                <Button
                    size="sm"
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                    {isOptimizing ? <ArrowDownUp className="animate-spin" size={16} /> : <ArrowDownUp size={16} />}
                    Optimize Schedule
                </Button>
            </div>

            {/* Strips List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {scenes.map((scene) => (
                    <div
                        key={scene.id}
                        className={`
                            border-l-4 rounded-r-md p-3 flex items-center gap-4 bg-surface border-white/5 shadow-sm hover:bg-white/5 transition-colors
                            ${scene.type === 'INT' ? 'border-l-yellow-500' : 'border-l-blue-500'} 
                        `}
                    >
                        {/* Scene Number */}
                        <div className="w-12 text-center border-r border-white/10 pr-2">
                            <span className="block text-xs text-muted uppercase">Scene</span>
                            <span className="text-xl font-mono font-bold">{scene.number}</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${scene.type === 'INT' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                    {scene.type}
                                </span>
                                <span className="font-bold truncate text-white">{scene.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted">
                                {scene.cast.length > 0 && (
                                    <span className="truncate max-w-[200px]">
                                        Wait: {scene.cast.join(', ')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-col items-end gap-1 text-xs text-muted">
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{scene.time}</span>
                            </div>
                            <div className="bg-white/5 px-2 py-0.5 rounded text-[10px]">
                                ~{scene.lengthInLines} lns
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-2 text-center text-[10px] text-muted border-t border-white/5">
                Yellow = INT • Blue = EXT
            </div>
        </div>
    );
};

export default ScheduleBoard;
