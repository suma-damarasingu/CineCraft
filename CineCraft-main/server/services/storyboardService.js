const { generateImage } = require('./imageService');
const { parseScript } = require('./scriptParser');
const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

// const baseInstruction = "A rough, low-fidelity black and white storyboard sketch. Loose pencil sketch style, architectural drawing style. Characters must be faceless mannequins or blocky silhouettes. Focus on composition, perspective lines, and depth. High contrast, white background. NO detailed faces, NO shading, NO colors, NO photorealism.";

const baseInstruction = "A cinematic colored storyboard sketch. Use vibrant, expressive lighting and colors to convey mood. Loose artistic style with broad brushstrokes and marker fills. Characters are stylized silhouettes. Focus on composition, perspective, and atmospheric depth. NO photorealism, NO fine details.";

const generateStoryboardForScript = async (scriptId, scriptContent) => {
    console.log(`Starting storyboard generation for script: ${scriptId}`);

    try {
        const db = getDb();
        const triggers = parseScript(scriptContent);

        if (triggers.length === 0) {
            console.log("No visual triggers found in script.");
            return;
        }

        console.log(`Found ${triggers.length} triggers. Starting image generation...`);

        // Update script to initialize empty storyboard array (or clear old one)
        await db.collection('screenplays').updateOne(
            { _id: new ObjectId(scriptId) },
            { $set: { storyboard: [] } }
        );

        // Process sequentially to be safe with rate limits, or parallel with limit.
        // Given "Performance: Image generation is slow", sequential or small batch is safer for stability.
        // We will do sequential for now to avoid overwhelming the inference API.

        for (const [index, trigger] of triggers.entries()) {
            try {
                const dynamicContent = `[${trigger.type.toUpperCase()}] ${trigger.text}`;
                const finalPrompt = `${baseInstruction} ${dynamicContent}`;

                console.log(`Generating frame ${index + 1}/${triggers.length}: ${trigger.type}`);

                const imageUrl = await generateImage(finalPrompt);

                const frame = {
                    id: new ObjectId(), // Unique ID for the frame
                    triggerType: trigger.type,
                    scriptText: trigger.text,
                    imageUrl: imageUrl,
                    promptUsed: finalPrompt,
                    orderIndex: index
                };

                // Push this frame to the database immediately so user sees progress
                await db.collection('screenplays').updateOne(
                    { _id: new ObjectId(scriptId) },
                    { $push: { storyboard: frame } }
                );

            } catch (err) {
                console.error(`Failed to generate frame for trigger: ${trigger.text.substring(0, 20)}...`, err);
                // Continue to next trigger
            }
        }

        console.log(`Storyboard generation complete for script: ${scriptId}`);

    } catch (error) {
        console.error("Storyboard Service Error:", error);
        // Could update script status to 'failed' if we had a status field
    }
};

module.exports = { generateStoryboardForScript };
