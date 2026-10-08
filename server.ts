import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent as per guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    app: 'LocalLens AI Nearby Street Shop Finder',
    developer: 'Nisha Mary J',
  });
});

// AI Shop Recommendation Endpoint
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const { userQuery, shops, userPreferences } = req.body;

    if (!userQuery && (!userPreferences || userPreferences.length === 0)) {
      return res.status(400).json({ error: 'Query or preferences required' });
    }

    if (!ai) {
      // Heuristic fallback matching when no API key is provided
      const queryLower = (userQuery || '').toLowerCase();
      const scoredShops = (shops || []).map((shop: any) => {
        let score = 70;
        const matchesName = shop.name.toLowerCase().includes(queryLower);
        const matchesCat = shop.category.toLowerCase().includes(queryLower);
        const matchesTags = (shop.tags || []).some((t: string) =>
          queryLower.includes(t.toLowerCase()) || t.toLowerCase().includes(queryLower)
        );
        const matchesItems = (shop.specialties || []).some((i: string) =>
          queryLower.includes(i.toLowerCase()) || i.toLowerCase().includes(queryLower)
        );

        if (matchesName || matchesItems) score += 25;
        if (matchesCat || matchesTags) score += 15;
        if (shop.isOpen) score += 5;
        // distance penalty: closer gets higher score
        if (shop.distanceMeters < 200) score += 5;

        return {
          id: shop.id,
          matchScore: Math.min(score, 99),
          aiReason: `Convenient local option matching "${userQuery || 'your tastes'}" just ${Math.round(shop.distanceMeters)}m away.`,
          recommendedItem: shop.specialties?.[0] || 'Popular local choice',
        };
      });

      return res.json({ recommendations: scoredShops });
    }

    // Call Gemini 3.8 Flash for intelligent ranking
    const prompt = `You are the AI Recommendation Engine for "LocalLens - Nearby Street Shop Finder", a hyper-local street vendor discovery app (0.5km focus).
User request / context: "${userQuery || 'Suggest the best street stalls and small vendors nearby'}"
User preferences: ${JSON.stringify(userPreferences || [])}

Here is the list of nearby street shops within 500m:
${JSON.stringify(
  (shops || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    specialties: s.specialties,
    distanceMeters: Math.round(s.distanceMeters),
    isOpen: s.isOpen,
    priceRange: s.priceRange,
    rating: s.rating,
  }))
)}

Analyze each shop and return a JSON array of objects with:
- "id": string (the exact shop id from input)
- "matchScore": integer from 40 to 99 (relevance percentage)
- "aiReason": a crisp 1-sentence explanation of why this street shop is great for the user's intent
- "recommendedItem": the specific item/service to ask the vendor for

Respond ONLY with valid JSON array without markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    const rawText = response.text || '';
    let parsed: any[] = [];
    try {
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = (shops || []).map((s: any) => ({
        id: s.id,
        matchScore: 85,
        aiReason: `${s.name} is highly rated within 500m for authentic local service.`,
        recommendedItem: s.specialties?.[0] || 'Local special',
      }));
    }

    res.json({ recommendations: parsed });
  } catch (err: any) {
    console.error('Error in /api/ai/recommend:', err);
    res.status(500).json({ error: err.message || 'Internal AI Error' });
  }
});

// AI Street Vendor Pitch Generator (for shop owner onboarding)
app.post('/api/ai/vendor-pitch', async (req, res) => {
  try {
    const { shopName, category, landmark, items } = req.body;

    if (!ai) {
      return res.json({
        tagline: `Authentic ${category} stall serving fresh local favorites near ${landmark || 'the corner'}.`,
        highlights: ['Friendly local vendor', 'Quick turnaround', 'Affordable student rates'],
        dailyDeal: 'Flat 10% off for local college students & neighbors!',
      });
    }

    const prompt = `You are helping a small street vendor or mom-and-pop shop register on "LocalLens".
Shop Name: ${shopName}
Category: ${category}
Landmark / Street Spot: ${landmark}
Key items: ${items}

Generate an appealing, authentic street stall pitch in JSON:
{
  "tagline": "catchy 1-line description highlighting freshness or craft",
  "highlights": ["3 brief bullets about why locals love it"],
  "dailyDeal": "A simple suggested daily discount or street combo offer (e.g., 'Free extra chutney with every 2 plates', or '10% off before 11 AM')"
}
Respond ONLY in valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const clean = (response.text || '{}').trim();
    const data = JSON.parse(clean);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI Generation Failed' });
  }
});

// AI Hyperlocal Street Assistant (e.g. "Where can I get a quick xerox right now?", "Which chai tapri has bun maska?")
app.post('/api/ai/assistant', async (req, res) => {
  try {
    const { message, nearbyShops } = req.body;

    if (!ai) {
      return res.json({
        reply: `Within 500m, there are ${nearbyShops?.length || 0} local stalls and mom-and-pop shops available. Check out the top recommendations pinned on your radar map!`,
      });
    }

    const prompt = `You are "Lensy", the hyperlocal street assistant on LocalLens (developed by Nisha Mary J).
User asked: "${message}"
Shops currently within 500m:
${JSON.stringify(nearbyShops?.slice(0, 8))}

Give a friendly, concise, ultra-helpful answer pointing them directly to the right street vendor, noting distance and open status. Keep under 75 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ reply: response.text || 'Check out the nearby stalls on your map.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI Assistant Error' });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LocalLens server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
