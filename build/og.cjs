// Gera img/og-capa.jpg (prévia no WhatsApp), img/favicon.png e img/apple-touch-icon.png.
// Precisa do puppeteer-core, do sharp e do Google Chrome instalado. Rodar: node build/og.cjs
const puppeteer = require("puppeteer-core");
const sharp = require("sharp");
const path = require("path");
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

  // Ícone da aba: "Bp" vermelho sobre preto (pedido do dono), gerado pelo build/logo.cjs.
  // No iPhone o próprio sistema arredonda os cantos: por isso lá vai o quadrado.
  await sharp(path.join(__dirname, "icone.svg"), { density: 600 }).resize(64, 64).png().toFile(path.join(IMG, "favicon.png"));
  await sharp(path.join(__dirname, "icone-quadrado.svg"), { density: 900 }).resize(180, 180).png().toFile(path.join(IMG, "apple-touch-icon.png"));
  console.log("ok");
})();
