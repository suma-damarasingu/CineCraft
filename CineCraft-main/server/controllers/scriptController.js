const { generateScript } = require('../services/aiService');
const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

const createScript = async (req, res) => {
    try {
        const { storyLine, genre, tone, setting, characterName, characterTraits } = req.body;

        if (!storyLine) {
            return res.status(400).json({ error: "Story line is required." });
        }

        // Generate content using AI
        const scriptContent = await generateScript(req.body);

        // Prepare script document
        const scriptDoc = {
            storyLine,
            genre,
            tone,
            setting,
            characterName,
            characterTraits,
            script: scriptContent,
            createdAt: new Date(),
            lastModified: new Date(),
            images: []
        };

        // Save to MongoDB
        const db = getDb();
        if (!db) {
            throw new Error("Database not initialized");
        }
        const result = await db.collection('screenplays').insertOne(scriptDoc);

        res.status(201).json({
            success: true,
            scriptId: result.insertedId,
            script: scriptDoc
        });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getScriptById = async (req, res) => {
    try {
        const db = getDb();
        if (!db) throw new Error("Database not initialized");

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const script = await db.collection('screenplays').findOne({ _id: new ObjectId(req.params.id) });

        if (!script) {
            return res.status(404).json({ error: "Script not found" });
        }
        res.status(200).json(script);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ error: "Could not fetch script" });
    }
};

const getAllScripts = async (req, res) => {
    try {
        const db = getDb();
        if (!db) throw new Error("Database not initialized");

        // Return latest first, limit to 10 for now
        // Dont fetch full script content for list
        // Dont fetch images for list
        const scripts = await db.collection('screenplays')
            .find({})
            .project({ script: 0, images: 0, storyboard: 0 }) // Optimization: Don't fetch full script content for list
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();
        res.status(200).json(scripts);
    } catch (error) {
        console.error("Fetch All Error:", error);
        res.status(500).json({ error: "Could not fetch scripts", details: error.toString() });
    }
};

const updateScript = async (req, res) => {
    try {
        const db = getDb();
        if (!db) throw new Error("Database not initialized");

        const { id } = req.params;
        const updates = req.body; // Expecting { script: "new content", images: [...] } specific fields usually

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        updates.lastModified = new Date();
        // Remove _id from updates if present to avoid error
        delete updates._id;

        const result = await db.collection('screenplays').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Script not found" });
        }

        res.status(200).json({ success: true, message: "Script updated" });
    } catch (error) {
        console.error("Update Error", error);
        res.status(500).json({ error: "Could not update script" });
    }
};

const deleteScript = async (req, res) => {
    try {
        const db = getDb();
        if (!db) throw new Error("Database not initialized");

        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await db.collection('screenplays').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Script not found" });
        }

        res.status(200).json({ success: true, message: "Script deleted" });
    } catch (error) {
        console.error("Delete Error", error);
        res.status(500).json({ error: "Could not delete script" });
    }
};

const { generateStoryboardForScript } = require('../services/storyboardService');

const generateStoryboard = async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const script = await db.collection('screenplays').findOne({ _id: new ObjectId(id) });
        if (!script) {
            return res.status(404).json({ error: "Script not found" });
        }

        // Trigger async firing - do not await
        generateStoryboardForScript(id, script.script);

        res.status(202).json({
            message: "Storyboard generation started",
            scriptId: id
        });

    } catch (error) {
        console.error("Storyboard Controller Error:", error);
        res.status(500).json({ error: "Failed to start storyboard generation" });
    }
};

const getScriptCount = async (req, res) => {
    try {
        const db = getDb();
        if (!db) throw new Error("Database not initialized");

        const count = await db.collection('screenplays').countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error("Count Error:", error);
        res.status(500).json({ error: "Failed to get script count" });
    }
};

// Get story line and createdAt for 5 recent scripts
const getRecentScripts = async (req, res) => {
    try {
        const db = getDb();
        if (!db) throw new Error("Database not initialized");

        const scripts = await db.collection('screenplays')
            .find({})
            .project({ storyLine: 1, createdAt: 1 })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();
        res.status(200).json(scripts);
    } catch (error) {
        console.error("Recent Scripts Error:", error);
        res.status(500).json({ error: "Failed to get recent scripts" });
    }
};

module.exports = { createScript, getScriptById, getAllScripts, updateScript, deleteScript, generateStoryboard, getScriptCount, getRecentScripts };
