const parseScript = (scriptText) => {
    const lines = scriptText.split('\n');
    const triggers = [];

    // Regex patterns
    const sluglineRegex = /^(INT\.|EXT\.|I\/E\.|INT\/EXT)/i;
    const cameraRegex = /\b(CUT TO|CLOSE UP|WIDE SHOT|POV|PAN|ANGLE|ZOOM|FADE)\b/i;
    const characterRegex = /^[A-Z][A-Z0-9\s\(\)]+$/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (sluglineRegex.test(line)) {
            triggers.push({ type: 'slugline', text: line, index: i });
            continue;
        }

        if (cameraRegex.test(line)) {
            triggers.push({ type: 'camera', text: line, index: i });
            continue;
        }

        const prevLine = i > 0 ? lines[i - 1].trim() : '';
        const isPrevCharacter = characterRegex.test(prevLine);
        const isCurrentCharacter = characterRegex.test(line);

        if (!isPrevCharacter && !isCurrentCharacter) {
            if (line.length > 100) {
                triggers.push({ type: 'action', text: line, index: i });
            }
        }
    }
    return triggers;
};

const extractScenes = (scriptText) => {
    const lines = scriptText.split('\n');
    const scenes = [];
    let currentScene = null;
    let sceneIndex = 1;

    // Regex patterns
    const sluglineRegex = /^(INT\.|EXT\.|I\/E\.|INT\/EXT)\s+(.+?)\s+-\s+(.+)$/i;
    // Fallback for looser sluglines if strict one fails but starts with INT/EXT
    const looseSluglineRegex = /^(INT\.|EXT\.|I\/E\.|INT\/EXT)(.+)$/i;

    const characterRegex = /^[A-Z][A-Z0-9\s\(\)]+$/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check for Slugline (start of new scene)
        const strictMatch = line.match(sluglineRegex);
        const looseMatch = line.match(looseSluglineRegex);

        if (strictMatch || looseMatch) {
            // Save previous scene if exists
            if (currentScene) {
                // Approximate duration: 1 page = 1 min = ~55 lines. 
                // Very rough: just line count for now.
                currentScene.lengthInLines = i - currentScene.startLineIndex;
                scenes.push(currentScene);
            }

            // Start new scene
            let type = "UNK";
            let location = "UNKNOWN";
            let time = "UNKNOWN";

            if (strictMatch) {
                type = strictMatch[1].trim();
                location = strictMatch[2].trim();
                time = strictMatch[3].trim();
            } else if (looseMatch) {
                type = looseMatch[1].trim();
                // Try to split by dash if possible, else whole thing is location
                const parts = looseMatch[2].split('-');
                location = parts[0].trim();
                if (parts.length > 1) time = parts[1].trim();
            }

            currentScene = {
                id: `scene-${sceneIndex}`,
                number: sceneIndex,
                slugline: line,
                type: type.toUpperCase(), // INT, EXT
                location: location.toUpperCase(),
                time: time.toUpperCase(), // DAY, NIGHT
                startLineIndex: i,
                cast: new Set(),
                lengthInLines: 0 // Will Calculate at end or next scene
            };
            sceneIndex++;
            continue;
        }

        // Detect Characters in current scene
        if (currentScene && characterRegex.test(line)) {
            // Avoid transitions like "CUT TO:" matching as characters
            if (!line.includes(" TO:")) {
                const charName = line.split('(')[0].trim(); // Remove (V.O.) etc
                currentScene.cast.add(charName);
            }
        }
    }

    // Push final scene
    if (currentScene) {
        currentScene.lengthInLines = lines.length - currentScene.startLineIndex;
        scenes.push(currentScene);
    }

    // Convert Set to Array
    return scenes.map(s => ({
        ...s,
        cast: Array.from(s.cast)
    }));
};

module.exports = { parseScript, extractScenes };
