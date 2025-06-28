const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL obrigatória' });

  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const videoUrl = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video ? video.src : null;
    });

    await browser.close();

    if (!videoUrl) return res.status(404).json({ error: 'Vídeo não encontrado' });
    res.json({ videoUrl });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao processar link' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
