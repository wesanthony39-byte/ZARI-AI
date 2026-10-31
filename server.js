import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());
app.use(express.static("public"));

// Test the backend
app.get("/api/health", (req, res) => {
    res.json({
        status: "ZARD AI backend is running!"
    });
});

// Chat with Gemini
app.post("/api/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents:message
        });

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            error: "ZARD AI couldn't get a response. Please try again."
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`ZARD AI server running at http://localhost:${PORT}`);
});