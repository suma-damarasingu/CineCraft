const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');
const { extractScenes } = require('../services/scriptParser');

// GET /scripts/:id/breakdown
const getScriptBreakdown = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

        const db = getDb();
        const script = await db.collection('screenplays').findOne({ _id: new ObjectId(id) });
        if (!script) return res.status(404).json({ error: "Script not found" });

        if (!script.script) return res.status(200).json({ scenes: [] });

        const scenes = extractScenes(script.script);
        res.status(200).json({ scenes });

    } catch (error) {
        console.error("Breakdown Error:", error);
        res.status(500).json({ error: "Failed to generate breakdown" });
    }
};

// POST /scripts/:id/schedule/optimize
// (Alternatively, we can just do this on client side since we have the full list, 
// but doing it server side allows for more complex algorithms later)
const optimizeSchedule = async (req, res) => {
    try {
        const { scenes } = req.body;
        // Expecting the array of scenes we sent earlier.

        if (!scenes || !Array.isArray(scenes)) {
            return res.status(400).json({ error: "Invalid scenes data" });
        }

        // Sorting Logic:
        // 1. Group by Location (INT/EXT + Location Name)
        // 2. Then by Time (Day/Night) to minimize lighting setups

        const optimized = [...scenes].sort((a, b) => {
            // Compare Locations
            if (a.location < b.location) return -1;
            if (a.location > b.location) return 1;

            // If same location, compare Time
            if (a.time < b.time) return -1;
            if (a.time > b.time) return 1;

            return 0;
        });

        res.status(200).json({ optimizedScenes: optimized });

    } catch (error) {
        console.error("Optimization Error:", error);
        res.status(500).json({ error: "Failed to optimize schedule" });
    }
};

module.exports = { getScriptBreakdown, optimizeSchedule };
