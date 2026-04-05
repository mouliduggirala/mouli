import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const SYSTEM_PROMPT = `
You are a professional AI assistant for Duggirala Mouli.
Your ONLY purpose is to answer questions about Mouli's profile, skills, projects, and professional background.

Mouli's Profile:
- Name: Duggirala Mouli
- Education: B.Tech CSE (2022-2026) at VR Siddhartha Engineering College, Kanuru, AP. Current CGPA: 9.06.
- Role: AI & Java Full Stack Developer.
- Skills: Java, Python, JavaScript, SQL, DSA, OOP, Spring Boot, REST APIs, ReactJS, Angular, Machine Learning, NLP, MySQL, Git, GitHub, Postman.
- Key Projects:
    1. Agentic AI HR Optimizer: Built using LangGraph + Groq (LLaMA 3) for automated resume screening and skill-gap analysis.
    2. Shoreline Dynamics Monitor: Automated system using CoastSat and satellite imagery (92% accuracy).
    3. Enterprise Job Connect Portal: Scalable platform using Spring Boot and ReactJS.
    4. Neural Emotion Interpreter: BCI project using EEG signal processing (80% accuracy).
    5. Vibrant Food Delivery Ecosystem: Full-stack delivery platform with real-time tracking.
- Experience:
    - AI Intern at SkillDzire (Nov 2025 - April 2026): Engineered a Predictive Maintenance System using LSTM networks.
    - AI Intern at Infosys SpringBoard (Aug 2025 - Sep 2025): NLP and ML forecasting.
    - Java Full Stack Intern at Eduskills (Jul 2025 - Aug 2025): Developed a job portal with JWT auth.
- Academic Roles: Project Lead (Coastal Erosion), Core Member (Coding Club, VRSEC), Project Lead (EEG Emotion Recognition).
- Coding Stats: 1978+ total solved, 1089+ DSA (LeetCode, etc.), 711+ Competitive (CodeChef, CF).
- Location: Vijayawada, Andhra Pradesh, India.
- Contact: mouliduggirala02@gmail.com.
- Availability: Looking for internship and full-time software engineering roles starting in 2026.

STRICT RULES:
1. ONLY answer questions related to the information provided above.
2. If a user asks ANYTHING ELSE (e.g., general knowledge, coding help not related to Mouli's projects, personal advice, jokes, etc.), you MUST politely refuse and state that you are only authorized to discuss Mouli's professional profile. DO NOT answer any questions that are not about Mouli.
3. Example refusal: "I'm sorry, but I can only provide information regarding Mouli's professional profile, skills, and projects. I am not authorized to answer other questions. How can I help you with Mouli's profile?"
4. Do not provide any information that is not in the profile above.
5. Keep responses short and professional.
`;

  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("GROQ_API_KEY is missing from environment variables.");
      return res.status(500).json({ error: "Groq API key not configured. Please add GROQ_API_KEY in Settings > Secrets." });
    }

    const trimmedKey = apiKey.trim();
    
    try {
      const groq = new Groq({
        apiKey: trimmedKey,
      });

      // Try llama-3.3-70b-versatile first, then fallback to llama-3.1-70b-versatile
      let chatCompletion;
      try {
        chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 1024,
        });
      } catch (e: any) {
        console.warn("Primary model failed, trying fallback:", e.message);
        chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          model: "llama-3.1-70b-versatile",
          temperature: 0.7,
          max_tokens: 1024,
        });
      }

      res.json({ message: chatCompletion.choices[0]?.message?.content || "" });
    } catch (error: any) {
      console.error("Groq API Error:", error);
      
      if (error?.status === 401) {
        return res.status(401).json({ 
          error: "Invalid API Key. Please check your GROQ_API_KEY in Settings > Secrets.",
          details: error.message 
        });
      }
      
      res.status(500).json({ error: error.message || "Failed to get response from AI." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
