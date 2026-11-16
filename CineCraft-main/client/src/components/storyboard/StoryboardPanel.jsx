import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Video, Type } from 'lucide-react';

const StoryboardPanel = ({ storyboard, isLoading, onGenerate }) => {
    if (!storyboard || storyboard.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted p-8 text-center bg-gray-50/5 border-l border-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20">
                    <ImageIcon size={32} />
                </div>
                <h3 className="text-xl font-medium mb-2">No Storyboard Yet</h3>
                <p className="mb-6 max-w-xs">Generate a rough visual plan based on your script's actions and camera moves.</p>
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="bg-primary text-background px-6 py-2 rounded-full font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? 'Generating...' : 'Generate Storyboard'}
                </button>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6 border-l border-white/10 bg-black/20">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold font-serif">Storyboard</h3>
                <span className="text-xs text-muted uppercase tracking-wider">{storyboard.length} Frames</span>
            </div>

            <div className="space-y-8">
                {storyboard.map((frame, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={frame.id || index}
                        className="bg-white p-3 rounded-sm shadow-xl"
                    >
                        {/* Frame Image */}
                        <div className="aspect-video bg-gray-200 mb-3 overflow-hidden border border-gray-300 relative">
                            {frame.imageUrl ? (
                                <img
                                    src={frame.imageUrl}
                                    alt={`Frame ${index + 1}`}
                                    className="w-full h-full object-cover grayscale contrast-125"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 animate-pulse">
                                    Pending...
                                </div>
                            )}

                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] uppercase font-bold tracking-wider">
                                {frame.triggerType}
                            </div>
                        </div>

                        {/* Frame Metadata */}
                        <div className="flex items-start gap-3">
                            <span className="text-2xl font-bold text-gray-300 font-mono -mt-1">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <div>
                                <p className="text-gray-800 text-sm font-mono leading-tight border-l-2 border-primary/50 pl-2">
                                    {frame.scriptText}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="p-4 rounded border border-dashed border-white/20 text-center animate-pulse">
                        <span className="text-sm text-muted">Analyzing script and sketching frames...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryboardPanel;
