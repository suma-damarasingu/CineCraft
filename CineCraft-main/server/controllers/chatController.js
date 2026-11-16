const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');
const { chatWithScript } = require('../services/aiService');

const chatScript = async (req, res) => {
    try {
        // We expect { scriptId, message, history } in body
        const { scriptId, message, history = [] } = req.body;

        if (!scriptId || !message) {
            return res.status(400).json({ error: "Missing scriptId or message" });
        }

        const db = getDb();
        const scriptDoc = await db.collection('screenplays').findOne({ _id: new ObjectId(scriptId) });

        if (!scriptDoc || !scriptDoc.script) {
            return res.status(404).json({ error: "Script content not found" });
        }

        const reply = await chatWithScript({
            scriptContent: scriptDoc.script,
            message,
            history
        });

        res.status(200).json({ reply });

    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ error: "Failed to process chat" });
    }
};

module.exports = { chatScript };
