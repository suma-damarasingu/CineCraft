const { generateImage } = require('../services/imageService');

const createSceneImage = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Image prompt is required." });
        }

        // Add cinematic keywords to guide style
        const cinematicPrompt = `${prompt}, cinematic film still, 4k, incredibly detailed, dramatic lighting, shot on 35mm lens, masterpiece`;

        const imageUrl = await generateImage(cinematicPrompt);

        res.status(200).json({
            success: true,
            imageUrl
        });

    } catch (error) {
        console.error("Image Controller Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

module.exports = { createSceneImage };
