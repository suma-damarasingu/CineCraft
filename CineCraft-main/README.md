# CineCraft 🎬 
**AI-Powered Screenplay Development Suite**

CineCraft is a modern, full-stack application designed to empower screenwriters and filmmakers with AI tools. It streamlines the creative process from ideation to pre-production, offering features like script generation, storyboard visualization, character development, and shoot scheduling.

## 🚀 Features

### 1. **AI Script Generator**
- Generate professional standard screenplays from simple prompts.
- Customizable parameters: Genre, Tone, Setting, Character Traits.
- **Tech**: Powered by Google Gemini 2.5 Flash.

### 2. **Context-Aware Script Assistant ("Ask the Scene")**
- Chat with your script! The AI understands the full context of your screenplay.
- Ask for plot hole checks, dialogue improvements, or character motivation analysis.
- **Tech**: Gemini 2.5 Flash Lite with full context window injection.

### 3. **AI Storyboard Generator**
- Visualize your script automatically.
- Parses script sluglines and actions to generate cinematic storyboard frames.
- **Style**: Rough, cinematic, colored sketches for mood and composition.
- **Tech**: HuggingFace Inference API (Flux/Stable Diffusion).

### 4. **Character Studio**
- **Creation Wizard**: Generate complex characters with backstories, flaws, and motivations.
- **Foil Generator**: Create the perfect antagonist by analyzing your protagonist's traits and generating their philosophical opposite.

### 5. **Shoot Schedule Optimizer**
- Automatically breaks down scripts into scenes.
- **Stripboard UI**: Visualize scenes color-coded by INT/EXT and DAY/NIGHT.
- **Start-of-Day Logic**: Optimizes shooting order by grouping locations to minimize company moves.

### 6. **Production Hub**
- Dashboard to manage your portfolio of scripts.
- Track writing time and character counts.

---

## 🛠️ Technology Stack

### **Frontend (Client)**
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Markdown**: React Markdown (for AI chat responses)
- **Routing**: React Router v7

### **Backend (Server)**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Structure: Scripts, Characters Collections)
- **AI Integration**:
  - `@google/genai` (Gemini SDK)
  - `@huggingface/inference` (Image Generation)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Google Gemini API Key
- HuggingFace API Key

### 1. Clone the Repository
```bash
git clone <repository_url>
cd CineCraft
```

### 2. Setup Backend
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```env
PORT=3004
MONGODB_URI=mongodb://localhost:27017/cinecraft
GEMINI_API_KEY=your_gemini_key
HUGGINGFACE_TOKEN=your_hf_token
```
Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
```
Start the client:
```bash
npm run dev
```

## 🎥 Usage
1. Open `http://localhost:5173`.
2. Navigate to **"New Project"** to create a script.
3. Use the **Character Studio** to build your cast.
4. Open a script to access the **Workspace**:
   - **Editor**: View/Edit text.
   - **Storyboard**: Generate visuals.
   - **Schedule**: Optimize shooting order.
   - **Assistant**: Chat with the script.

---
*Built with ❤️ for Storytellers.*
