const { generateCharacterTraits } = require('../services/aiService');
const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

// Generate Traits (AI)
const generateTraits = async (req, res) => {
    try {
        const { scriptContext, role, oppositeCharacterId } = req.body;
        let oppositeCharacter = null;

        // If oppositeCharacterId is provided, fetch the full character data to pass to AI
        if (oppositeCharacterId) {
            const db = getDb();
            oppositeCharacter = await db.collection('characters').findOne({ _id: new ObjectId(oppositeCharacterId) });
        }

        const traits = await generateCharacterTraits({
            scriptContext,
            role,
            oppositeCharacter
        });

        res.status(200).json(traits);
    } catch (error) {
        console.error("Trait Gen Controller Error:", error);
        res.status(500).json({ error: "Failed to generate traits" });
    }
};

// Create Character (Save final selection)
const createCharacter = async (req, res) => {
    try {
        const { name, role, philosophy, style, tool, flaw, rivalId } = req.body;

        if (!name || !role) {
            return res.status(400).json({ error: "Name and Role are required" });
        }

        const characterDoc = {
            name,
            role, // 'Protagonist' or 'Antagonist'
            philosophy,
            style,
            tool,
            flaw,
            rivalId: rivalId ? new ObjectId(rivalId) : null,
            createdAt: new Date()
        };

        const db = getDb();
        const result = await db.collection('characters').insertOne(characterDoc);

        res.status(201).json({ success: true, characterId: result.insertedId, character: characterDoc });

    } catch (error) {
        console.error("Create Character Error:", error);
        res.status(500).json({ error: "Failed to save character" });
    }
};

// Get All Characters (for Rival selection and List)
const getAllCharacters = async (req, res) => {
    try {
        const db = getDb();
        const characters = await db.collection('characters').find({}).sort({ createdAt: -1 }).toArray();
        res.status(200).json(characters);
    } catch (error) {
        console.error("Get Characters Error:", error);
        res.status(500).json({ error: "Failed to fetch characters" });
    }
};

const getCharacterCount = async (req, res) => {
    try {
        const db = getDb();
        if (!db) throw new Error("Database not initialized");

        const count = await db.collection('characters').countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error("Count Error:", error);
        res.status(500).json({ error: "Failed to get character count" });
    }
};

module.exports = { generateTraits, createCharacter, getAllCharacters, getCharacterCount };
