import React, { useState, useEffect } from 'react';


const ScriptEditor = ({ initialScript, onScriptChange }) => {
    const [script, setScript] = useState(initialScript || '');

    useEffect(() => {
        setScript(initialScript || '');
    }, [initialScript]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setScript(newValue);
        if (onScriptChange) {
            onScriptChange(newValue);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white text-black shadow-2xl min-h-[800px] p-10 font-mono text-lg leading-relaxed relative rounded-sm">
            {/* Paper texture overlay (optional CSS trick, keeping it simple white for now) */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-200 to-transparent opacity-20 pointer-events-none" />

            <textarea
                className="w-full h-full min-h-[720px] resize-none border-none focus:ring-0 outline-none bg-transparent font-mono text-black placeholder:text-gray-400"
                style={{ fontFamily: '"Courier Prime", monospace' }}
                value={script}
                onChange={handleChange}
                spellCheck={false}
                placeholder="EXT. SCENE - DAY..."
            />
        </div>
    );
};

export default ScriptEditor;
