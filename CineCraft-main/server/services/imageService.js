// Using dynamic import for @huggingface/inference as it might be ESM-only
// and our server is CommonJS.

const generateImage = async (prompt) => {
    try {
        const { InferenceClient } = await import("@huggingface/inference");

        const apiKey = process.env.HUGGING_FACE_API_KEY;
        const modelId = process.env.HF_MODEL_ID || "fal/FLUX.2-dev-Turbo";

        if (!apiKey) {
            throw new Error("Hugging Face API Key is missing.");
        }

        const client = new InferenceClient(apiKey);

        const imageBlob = await client.textToImage({
            model: modelId,
            inputs: prompt,
            parameters: { num_inference_steps: 25 },
        });

        // Convert Blob to Base64
        const arrayBuffer = await imageBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

        return base64Image;

    } catch (error) {
        console.error("Image Service Error:", error);
        throw new Error(`Failed to generate image: ${error.message}`);
    }
};

module.exports = { generateImage };
