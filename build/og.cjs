// Gera img/og-capa.jpg (prévia no WhatsApp), img/favicon.png e img/apple-touch-icon.png.
// Precisa do puppeteer-core, do sharp e do Google Chrome instalado. Rodar: node build/og.cjs
const puppeteer = require("puppeteer-core");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const IMG = path.join(__dirname, "..", "img");
(async () => {
  const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--allow-file-access-from-files"] });
  const p = await b.newPage();
  await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await p.goto(require("url").pathToFileURL(path.join(__dirname, "og.html")).href, { waitUntil: "networkidle0" });
  await p.evaluate(() => document.fonts.ready);
  const png = await p.screenshot({ type: "png" });
  await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(IMG, "og-capa.jpg"));
  await b.close();

  // Ícone: o "p" vermelho do logo sobre fundo preto (lê bem pequeno na aba do navegador).
  const logo = fs.readFileSync(path.join(IMG, "logo-branco.svg"), "utf8");
  const pVermelho = logo.match(/<path fill="#F2353D" d="([^"]+)"/)[1];
  const nums = pVermelho.match(/-?\d+(\.\d+)?/g).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1);
  const x1 = Math.min(...xs), x2 = Math.max(...xs), y1 = Math.min(...ys), y2 = Math.max(...ys);
  const lado = Math.max(x2 - x1, y2 - y1) * 1.35;
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
  const svg = (raio) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${cx - lado / 2} ${cy - lado / 2} ${lado} ${lado}"><rect x="${cx - lado / 2}" y="${cy - lado / 2}" width="${lado}" height="${lado}" rx="${lado * raio}" fill="#000"/><path fill="#E3151E" d="${pVermelho}"/></svg>`);
  await sharp(svg(0.22), { density: 600 }).resize(64, 64).png().toFile(path.join(IMG, "favicon.png"));
  await sharp(svg(0), { density: 900 }).resize(180, 180).png().toFile(path.join(IMG, "apple-touch-icon.png"));
  console.log("ok");
})();
