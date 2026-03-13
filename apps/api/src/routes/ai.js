import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import express from 'express';
import Groq from 'groq-sdk';
import prisma from '@repo/database';
import multer from 'multer';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// Load env vars from apps/api/.env (for GROQ_API_KEY) and packages/database/.env (for DATABASE_URL)
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../.env') });
config({ path: resolve(__dirname, '../../../../packages/database/.env') });

import { auth } from '../middleware/auth.js';

const router = express.Router();

// Handle file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Utility func to split long text into ~1500 char chunks to avoid context limits
function chunkText(text, maxLen = 1500) {
  const chunks = [];
  let currentChunk = '';
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLen) {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks;
}

// Helper to check for staff roles
const isStaff = (req, res, next) => {
  if (req.user.role === 'STUDENT') {
    return res.status(403).json({ error: 'Forbidden: Students cannot manage knowledge base' });
  }
  next();
};

// POST /api/ai/knowledge/upload - upload and parse a PDF (Protected: Admin/Faculty Only)
router.post('/knowledge/upload', auth, isStaff, upload.single('file'), async (req, res) => {
  try {
    console.log('--- Incoming PDF Upload ---');
    if (!req.file) {
      console.error('No file received');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('File size:', req.file.buffer.length, 'bytes');

    const { titlePrefix } = req.body;
    const prefix = titlePrefix || req.file.originalname.replace('.pdf', '');

    // Parse the PDF buffer
    const require = createRequire(import.meta.url);
    const pdfParseModule = require('pdf-parse');
    const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : (pdfParseModule.default || pdfParseModule);
    
    if (typeof pdfParse !== 'function') {
      console.error('pdfParse resolution failed. Type:', typeof pdfParse);
      throw new Error(`pdfParse is not a function. Type: ${typeof pdfParse}`);
    }

    console.log('Extracting text from PDF...');
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text.replace(/\n+/g, ' ').trim();
    console.log('Extracted text length:', text.length);

    if (!text) {
      console.error('Text extraction returned empty result');
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    const chunks = chunkText(text);
    console.log('Created chunks:', chunks.length);
    
    // Save each chunk
    const entries = chunks.map((chunk, index) => ({
      title: `${prefix} - Part ${index + 1}`,
      content: chunk
    }));

    console.log('Saving chunks to database...');
    await prisma.campusKnowledge.createMany({
      data: entries
    });

    console.log('Upload success!');
    res.json({ success: true, chunksAdded: entries.length });
  } catch (error) {
    console.error('PDF Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // 1. Retrieve all campus knowledge from database for RAG context
    const knowledgeEntries = await prisma.campusKnowledge.findMany({
      select: { title: true, content: true }
    });

    // Build context string from all knowledge entries
    const context = knowledgeEntries
      .map(entry => `[${entry.title}]: ${entry.content}`)
      .join('\n');

    // 2. Build RAG prompt and send to Groq LLM
    const prompt = `You are an intelligent AI Campus Assistant for a Smart University.
Use ONLY the provided campus database context to answer the student's question.
Answer clearly and concisely in 1-3 sentences.
If the answer is not in the context, respond: "I don't have that information right now."

Campus Knowledge Base:
${context}

Student Question: ${query}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
    });

    const answer = completion.choices[0]?.message?.content || 'Unable to generate a response.';

    res.json({ answer });
  } catch (error) {
    console.error('Error processing AI query:', error);
    res.status(500).json({ error: error.message || 'Internal server error while processing AI query.' });
  }
});

// GET /api/ai/knowledge - fetch all knowledge entries (Protected: Admin/Faculty Only)
router.get('/knowledge', auth, isStaff, async (req, res) => {
  try {
    const entries = await prisma.campusKnowledge.findMany({
      orderBy: { title: 'asc' }
    });
    res.json({ entries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/knowledge - add a new knowledge entry (Protected: Admin/Faculty Only)
router.post('/knowledge', auth, isStaff, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' });
    }
    const entry = await prisma.campusKnowledge.create({
      data: { title, content }
    });
    res.json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/ai/knowledge/:id - delete a knowledge entry (Protected: Admin/Faculty Only)
router.delete('/knowledge/:id', auth, isStaff, async (req, res) => {
  try {
    await prisma.campusKnowledge.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
