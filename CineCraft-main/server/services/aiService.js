const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

const generateScript = async (data) => {
    try {

        const {
            storyLine,
            genre = "Drama",
            tone = "Cinematic",
            setting = "Unknown",
            characterName,
            characterTraits
        } = data;

        const charSection = characterName
            ? `Main Character: ${characterName} (${characterTraits || 'N/A'})`
            : 'Main Character: Create a compelling protagonist fitting the story.';

        const prompt = `
      You are an expert Hollywood Screenwriter and Director. 
      Write a cinematic, screenplay-formatted script (~200 words) based on the following:

      STORY LINE: ${storyLine}
      GENRE: ${genre}
      TONE: ${tone}
      SETTING: ${setting}
      ${charSection}

      FORMATTING RULES:
      1. Use standard screenplay format (Sluglines, Action Lines, Dialogue).
      2. Start with a SLUGLINE (EXT. or INT.).
      3. Use VISUAL, high-contrast descriptions. Show, don't tell.
      4. Keep dialogue sharp and realistic.
      5. Do NOT include camera instructions like "CUT TO" unless absolutely necessary for impact.
      6. Output ONLY the script text, no preambles or markdown code blocks (unless necessary for formatting).
    `;

        const result = await genAI.models.generateContent(
            {
                model: "gemini-2.5-flash",
                contents: prompt
            });
        return result.text;

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate script from AI service.");
    }
};

const generateCharacterTraits = async (data) => {
    try {
        const { scriptContext, role, oppositeCharacter } = data;

        let prompt = "";

        if (oppositeCharacter) {
            // Foil / Contrast Mode
            prompt = `
                CONTEXT: We are building a VILLAIN (Antagonist) for a movie script.
                THE HERO (Protagonist) is defined as: ${JSON.stringify(oppositeCharacter)}.
                
                TASK: Generate a Villain profile that is the EXACT PHILOSOPHICAL AND PHYSICAL OPPOSITE of this Hero.
                - If Hero uses 'Nature/Instinct', Villain must use 'Tech/Calculation'.
                - If Hero fights for 'Freedom', Villain must fight for 'Order'.
                - If Hero is 'Physically Weak but Smart', Villain must be 'Physically Imposing but Simple'.
                
                OUTPUT: Provide 5 distinct selectable options for EACH of the following categories:
                1. Core Philosophy (The "Why")
                2. Visual Style (The "Look")
                3. Weapon/Tool of Choice (The "How")
                4. Fatal Flaw (The "Weakness")

                Return ONLY raw JSON in this format:
                {
                    "philosophies": ["Option A", "Option B", ...],
                    "styles": ["Option A", "Option B", ...],
                    "tools": ["Option A", "Option B", ...],
                    "flaws": ["Option A", "Option B", ...]
                }
            `;
        } else {
            // Standard Mode
            prompt = `
                CONTEXT: We are building a ${role.toUpperCase()} for a movie script.
                SCRIPT CONTEXT: ${scriptContext || "General Cinematic Universe"}
                
                TASK: Suggest traits for this character.
                
                OUTPUT: Provide 5 distinct selectable options for EACH of the following categories:
                1. Core Philosophy
                2. Visual Style
                3. Weapon/Tool of Choice
                4. Fatal Flaw

                Return ONLY raw JSON in this format:
                {
                    "philosophies": ["Option A", "Option B", ...],
                    "styles": ["Option A", "Option B", ...],
                    "tools": ["Option A", "Option B", ...],
                    "flaws": ["Option A", "Option B", ...]
                }
            `;
        }

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // Detect valid text property
        let text = result.text;
        if (typeof text === 'function') {
            text = text();
        }

        if (!text && result.response) {
            text = typeof result.response.text === 'function' ? result.response.text() : result.response.text;
        }

        console.log("Raw AI Response:", text);

        // Clean Markdown if present (```json ... ```)
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonResponse = JSON.parse(cleanedText);

        // Normalize keys to lowercase just in case
        const normalizedResponse = {
            philosophies: jsonResponse.philosophies || jsonResponse.Philosophies || [],
            styles: jsonResponse.styles || jsonResponse.Styles || [],
            tools: jsonResponse.tools || jsonResponse.Tools || [],
            flaws: jsonResponse.flaws || jsonResponse.Flaws || []
        };

        return normalizedResponse;

    } catch (error) {
        console.error("AI Character Gen Error:", error);
        throw new Error("Failed to generate character traits");
    }
};

const chatWithScript = async (data) => {
    try {
        const { scriptContent, message, history } = data;

        // Construct formatting instructions and context
        const systemPrompt = `
            You are a helpful and intelligent Script Assistant.
            You have access to the FULL SCRIPT content below.
            Answer the user's questions strictly based on this script.
            
            SCRIPT CONTENT:
            """
            ${scriptContent}
            """
            
            RULES:
            1. Be concise but helpful.
            2. If asked about a character, cite specific scenes or actions.
            3. If asked for a summary, provide a high-level beat sheet.
            4. If the user asks something unrelated to the script, gently guide them back.
            5. Use markdown for nice formatting (bold keys, lists).
        `;

        // Format history for the new SDK
        // Expecting: { role: string, parts: [{ text: string }] }
        const formattedHistory = [
            {
                role: "user",
                parts: [{ text: systemPrompt }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I have read the script and am ready to assist." }],
            },
            ...history.map(h => ({
                role: h.role === 'model' ? 'model' : 'user',
                parts: [{ text: h.content }]
            }))
        ];

        // Use new SDK pattern
        // Note: genAI is the client instance here.
        const chat = genAI.chats.create({
            model: "gemini-2.5-flash-lite",
            history: formattedHistory
        });

        const result = await chat.sendMessage({
            message: message,
            config: {
                maxOutputTokens: 1000,
            }
        });

        // result.text is the response string directly in the new SDK??
        // User snippet says: console.log(response.text);
        return result.text;

    } catch (error) {
        console.error("Chat Error:", error);
        throw new Error("Failed to chat with script");
    }
};

module.exports = { generateScript, generateCharacterTraits, chatWithScript };
