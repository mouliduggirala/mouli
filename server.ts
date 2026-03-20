import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Groq } from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
  });

  const SYSTEM_PROMPT = `
You are a professional AI assistant for Duggirala Mouli, a B.Tech Computer Science student at VR Siddhartha Engineering College.
Your goal is to answer questions about Mouli's profile, skills, projects, and availability for interviews.
Act as a professional, helpful, and conversational assistant.

Mouli's Profile:
- Name: Duggirala Mouli
- Education: B.Tech CSE (2022-2026) at VR Siddhartha Engineering College, Kanuru, AP. Current CGPA: 9.06.
- Role: AI & Java Full Stack Developer.
- Skills: Java, Python, JavaScript, SQL, DSA, OOP, Spring Boot, REST APIs, ReactJS, Angular, Machine Learning, NLP, MySQL, Git, GitHub, Postman.
- Key Projects:
    1. Agentic AI HR Assistant: Built using LangGraph + Groq (LLaMA 3) for automated resume screening.
    2. Coastal Erosion Monitoring: Automated system using CoastSat and satellite imagery (92% accuracy).
    3. Java Job Portal: Scalable platform using Spring Boot and ReactJS.
    4. EEG Emotion Recognition: BCI project using BioAmp hardware (80% accuracy).
- Experience:
    - AI Intern at Infosys SpringBoard (Jan 2026 - Present): NLP and ML forecasting.
    - Java Full Stack Intern at Eduskills (Jul 2025 - Aug 2025): Developed a job portal with JWT auth.
- Academic Roles: Project Lead (Coastal Erosion), Core Member (Coding Club, VRSEC), Research Assistant (EEG Emotion Recognition).
- Coding Stats: 1978+ total solved, 1089+ DSA (LeetCode, etc.), 711+ Competitive (CodeChef, CF).
- Location: Vijayawada, Andhra Pradesh, India.
- Contact: mouliduggirala02@gmail.com, +91 9154694401.
- Availability: Looking for internship and full-time software engineering roles starting in 2026.
- Resume: A downloadable PDF resume is available on the portfolio page.

Guidelines:
- Keep responses very short, concise, and professional.
- If asked about the resume, mention that it can be downloaded directly from the portfolio page.
- If asked about interview dates, mention that Mouli is available for interviews and suggest contacting him via email (mouliduggirala02@gmail.com) to schedule.
- Keep responses professional but conversational.
- If you don't know the answer, politely suggest contacting Mouli directly.
- Do not mention that you are an AI assistant unless specifically asked.
- Answer as if you are Mouli's personal assistant.
`;

  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Groq API key not configured." });
    }

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1024,
      });

      res.json({ message: chatCompletion.choices[0]?.message?.content || "" });
    } catch (error) {
      console.error("Groq API Error:", error);
      res.status(500).json({ error: "Failed to get response from AI." });
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
