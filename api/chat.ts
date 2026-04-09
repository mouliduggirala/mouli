import Groq from "groq-sdk";

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
2. If a user asks ANYTHING ELSE (e.g., general knowledge, coding help not related to Mouli's projects, personal advice, jokes, etc.), you MUST return an EMPTY STRING. DO NOT provide any refusal message or explanation.
3. Do not provide any information that is not in the profile above.
4. Keep responses short and professional.
`;

type ChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const messages = req.body?.messages;
    if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request payload. 'messages' must be an array." });
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
        return res.status(500).json({ error: "Groq API key not configured on server." });
    }

    try {
        const groq = new Groq({ apiKey });

        let completion;
        try {
            completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 1024,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...(messages as ChatMessage[]),
                ],
            });
        } catch {
            completion = await groq.chat.completions.create({
                model: "llama-3.1-70b-versatile",
                temperature: 0.7,
                max_tokens: 1024,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...(messages as ChatMessage[]),
                ],
            });
        }

        return res.status(200).json({ message: completion.choices[0]?.message?.content ?? "" });
    } catch (error: any) {
        const status = Number.isInteger(error?.status) ? error.status : 500;
        return res.status(status).json({ error: error?.message || "Failed to get response from AI." });
    }
}
