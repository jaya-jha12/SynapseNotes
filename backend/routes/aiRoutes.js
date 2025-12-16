import express from 'express';
import multer from 'multer';
import { InferenceClient } from '@huggingface/inference';
import dotenv from 'dotenv';
import { verifyToken } from '../middlewares/authmiddleware.js';
import { createRequire } from 'module'; 
import Groq from "groq-sdk";

dotenv.config();
const router = express.Router();

const require = createRequire(import.meta.url);
const pdfExtract = require('pdf-extraction'); 


const hf = new InferenceClient(process.env.HF_ACCESS_TOKEN);
const upload = multer({ storage: multer.memoryStorage() });

async function queryHuggingFace(model, buffer) {
    
    const response = await fetch(`https://router.huggingface.co/hf-inference/models/${model}`, {
        headers: {
            Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}`,
            "Content-Type": "application/octet-stream",
        },
        method: "POST",
        body: buffer,
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HF API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return await response.json();
}

// ==========================================
// ROUTE 1: SUMMARIZE
// ==========================================
router.post('/summarize', verifyToken, upload.single('file'), async (req, res) => {
    try {
        let textToSummarize = req.body.text;

        if (req.file) {
            console.log("File uploaded:", req.file.mimetype);
            if (req.file.mimetype === 'application/pdf') {
                const data = await pdfExtract(req.file.buffer);
                textToSummarize = data.text;
            } else {
                textToSummarize = req.file.buffer.toString('utf-8');
            }
        }

        if (!textToSummarize || textToSummarize.trim().length < 20) {
            return res.status(400).json({ error: "Text is too short or empty." });
        }

        const maxLength = 12000; // Qwen can handle more context!
        if (textToSummarize.length > maxLength) {
            console.log(`Truncating text...`);
            textToSummarize = textToSummarize.slice(0, maxLength);
        }

        const result = await hf.chatCompletion({
            model: 'Qwen/Qwen2.5-72B-Instruct',
            messages: [
                { role: "system", content: "You are a helpful expert. Summarize the following document in clear, structured bullet points. Capture all key details." },
                { role: "user", content: textToSummarize }
            ],
            max_tokens: 1000, // Increased for better summaries
            temperature: 0.5
        });

        res.json({ summary: result.choices[0].message.content });

    } catch (error) {
        console.error("Summarize Error:", error);
        // Fallback to a simpler model if Qwen is busy
        try {
             const fallback = await hf.summarization({
                model: 'sshleifer/distilbart-cnn-12-6',
                inputs: req.body.text || "Text unavailable",
                parameters: { max_length: 200 }
             });
             res.json({ summary: fallback.summary_text });
        } catch (fallbackError) {
             res.status(500).json({ error: "Failed to summarize. Service is busy." });
        }
    }
});

// ==========================================
// ROUTE 2: TRANSCRIBE (Text-Only Mode)
// ==========================================
// Note: We removed 'upload.single('file')' because we are receiving JSON now.
router.post('/transcribe', verifyToken, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) return res.status(400).json({ error: "No text provided for summarization." });

        console.log("Input text length:", text.length);

        if (text.length < 50) {
            return res.json({ 
                summary: text, // The summary is just the text itself
                original: text
            });
        }

        const summaryRes = await hf.summarization({
            model: 'sshleifer/distilbart-cnn-12-6',
            inputs: text,
            parameters: {
                max_length: 150, // Keep summary concise
                min_length: 10
            }
        });

        // 3. SAFE RESPONSE HANDLING
        // The API might return an array or an object depending on the version
        const summaryText = summaryRes.summary_text || (summaryRes[0] && summaryRes[0].summary_text) || "Summary generated but empty.";

        res.json({ 
            summary: summaryText 
        });

    } catch (error) {
        console.error("Transcribe Summary Error:", error);
        
        // 4. FALLBACK (Prevents App Crash)
        // If the AI fails (500 error), send the original text back 
        // so the user still sees something on the screen.
        res.json({ 
            summary: "AI could not summarize (Service Busy). Here is the text: \n" + req.body.text
        });
    }
});

// ==========================================
// ROUTE 3: IMAGE TO NOTES (Via Groq - Llama 3.2 Vision)
// ==========================================
router.post('/image-to-notes', verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image provided." });

        console.log("Processing image with Groq Vision...");

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        // Convert image to base64
        const base64Image = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this image (diagram, slide, or text) and create clear, structured study notes. Use a main title, bullet points, and bold text for key concepts."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": dataUrl
                            }
                        }
                    ]
                }
            ],
            // Use the Free & Fast Llama 3.2 Vision model
            "model": "meta-llama/llama-4-scout-17b-16e-instruct",            "temperature": 0.5,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });

        const resultText = chatCompletion.choices[0].message.content;
        console.log("Groq Success!");

        res.json({ 
            raw_text: "Processed by Llama 3.2 Vision",
            formatted_notes: resultText
        });

    } catch (error) {
        console.error("Groq Image Error:", error);
        res.status(500).json({ error: "Failed to process image. " + error.message });
    }
});

// ==========================================
// ROUTE 4: CHAT (Final Fix with Qwen)
// ==========================================
router.post('/chat', verifyToken, async (req, res) => {
    try {
        const { context, message } = req.body;
        
        // 1. Safe Context
        const safeContext = context ? context.slice(0, 3000) : "No context provided.";

        // 2. Use Qwen-2.5 (Current Most Reliable Free Model)
        // Qwen is extremely smart and currently hosted reliably on the free router.
        const result = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [
                { 
                    role: "system", 
                    content: `You are a helpful assistant. Answer strictly based on the provided context. If the answer is not in the context, say so.\n\nCONTEXT:\n${safeContext}` 
                },
                { role: "user", content: message }
            ],
            max_tokens: 500,
            temperature: 0.6
        });

        // 3. Send Response
        res.json({ reply: result.choices[0].message.content });

    } catch (error) {
        console.error("Chat Error:", error);
        
        // If Qwen fails, try the backup model automatically
        try {
            console.log("Switching to backup model (Phi-3)...");
            const backupResult = await hf.chatCompletion({
                model: "microsoft/Phi-3-mini-4k-instruct",
                messages: [
                    { role: "system", content: "Answer based on context: " + safeContext },
                    { role: "user", content: message }
                ],
                max_tokens: 500
            });
            return res.json({ reply: backupResult.choices[0].message.content });
        } catch (backupError) {
            res.status(500).json({ error: "AI Service is currently busy. Please check your HF Token permissions." });
        }
    }
});

export default router;