/**
 * Nutreal – Serveur Express (Railway)
 * ────────────────────────────────────
 * 1. Proxifie les appels à l'API Gemini (clé côté serveur, jamais exposée au client)
 * 2. Sert le build Vite statique (dist/)
 *
 * Variables d'environnement à configurer sur Railway :
 *   GEMINI_API_KEY   → clé API Google Gemini
 *   PORT             → port (Railway l'injecte automatiquement)
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '25mb' })); // 25mb pour les images base64

// ─── Proxy Gemini ──────────────────────────────────────────────────────────────

// Health check — le frontend peut vérifier si la clé est configurée
app.get('/api/gemini/health', (_req, res) => {
  const configured = !!process.env.GEMINI_API_KEY;
  res.json({ configured });
});

// Proxy générique : POST /api/gemini?model=gemini-2.0-flash
// Le body JSON est directement forwardé à l'API Google
app.post('/api/gemini', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY non configurée sur le serveur Railway' });
  }

  const model = req.query.model || 'gemini-2.5-flash';
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    console.error('[Nutreal] Erreur proxy Gemini:', err);
    res.status(502).json({ error: 'Impossible de joindre l\'API Gemini', details: String(err) });
  }
});

// ─── Static (build Vite) ───────────────────────────────────────────────────────
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback — toutes les routes renvoient index.html
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// ─── Démarrage ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌴 Nutreal server listening on port ${PORT}`);
  console.log(`   Gemini API key: ${process.env.GEMINI_API_KEY ? '✅ configurée' : '❌ manquante'}`);
});
