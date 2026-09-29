// Recria o logo da Bruplast em vetor (a partir do cartão do Instagram e do logo do site antigo).
// Rodar: node build/logo.cjs  (precisa do opentype.js e das fontes Arial Black/Arial Bold do Windows).
// Letras em Arial Black, que é a fonte do logo original. Se o cliente mandar o arquivo original do logo, usar o dele.
// "Bru" + "p" vermelho + "l" em forma de moldura sobre "ast" + traço embaixo + slogan.
const opentype = require("opentype.js");
const fs = require("fs");
const out = process.argv[2] || require("path").join(__dirname, "..", "img");

const black = opentype.loadSync("C:/Windows/Fonts/ariblk.ttf");
const bold = opentype.loadSync("C:/Windows/Fonts/arialbd.ttf");

const S = 100; // tamanho da fonte (unidades do SVG)
const upm = black.unitsPerEm;
const k = S / upm;
const baseY = 100;

function glyphPath(font, text, x, y, size) {
  const p = font.getPath(text, x, y, size, { kerning: true });
  return { d: p.toPathData(1), w: font.getAdvanceWidth(text, size, { kerning: true }), bb: p.getBoundingBox() };
}

let x = 0;
const bru = glyphPath(black, "Bru", x, baseY, S);
x += bru.w - 1;
const p = glyphPath(black, "p", x, baseY, S);
const pBox = p.bb;
x += p.w;
// "l": uma barra vertical com a largura da haste do "B".
const lGlyph = black.charToGlyph("l").getBoundingBox();
const stem = (lGlyph.x2 - lGlyph.x1) * k; // largura da haste do l da Arial Black
const lX = x + (black.charToGlyph("l").leftSideBearing * k);
const capTop = baseY - (black.charToGlyph("l").getBoundingBox().y2 * k);
x = lX + stem + 4;
const ast = glyphPath(black, "ast", x, baseY, S);
const end = ast.bb.x2;

const barra = stem * 0.62; // espessura da moldura de cima
const moldura = [
  // l
  `M${lX.toFixed(1)} ${baseY}V${capTop.toFixed(1)}H${(end + 16).toFixed(1)}V${(capTop + stem * 1.25).toFixed(1)}H${(end + 16 - barra).toFixed(1)}V${(capTop + barra).toFixed(1)}H${(lX + stem).toFixed(1)}V${baseY}Z`,
].join("");

// traço embaixo, interrompido pela perna do "p"
const uY = baseY + 7;
const uH = 7;
const gap = 5;
const traco = `M${bru.bb.x1.toFixed(1)} ${uY}h${(pBox.x1 - gap - bru.bb.x1).toFixed(1)}v${uH}h${-(pBox.x1 - gap - bru.bb.x1).toFixed(1)}Z` +
  `M${(pBox.x2 + gap).toFixed(1)} ${uY}H${(end + 16).toFixed(1)}v${uH}H${(pBox.x2 + gap).toFixed(1)}Z`;

// slogan
const sloganTxt = "TUDO EM EMBALAGENS PLÁSTICAS LISAS E IMPRESSAS";
const totalW = end + 16 - bru.bb.x1;
let sz = 14;
const w0 = bold.getAdvanceWidth(sloganTxt, sz);
sz = sz * (totalW / w0);
const slogan = glyphPath(bold, sloganTxt, bru.bb.x1, uY + uH + 6 + sz * 0.72, sz);

const minX = bru.bb.x1 - 2;
const minY = capTop - 2;
const maxX = end + 18;
const maxY = Math.max(pBox.y2, uY + uH + 6 + sz * 0.72 + 1) + 2;
const vb = `${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`;

function svg(cor, vermelho, titulo) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${titulo}"><title>${titulo}</title>` +
    `<path fill="${cor}" d="${bru.d}${ast.d}${moldura}${traco}"/>` +
    `<path fill="${vermelho}" d="${p.d}"/>` +
    `<path fill="${cor}" d="${slogan.d}"/></svg>\n`;
}
fs.writeFileSync(out + "/logo.svg", svg("#111111", "#E3151E", "Bruplast - Tudo em embalagens plásticas lisas e impressas"));
fs.writeFileSync(out + "/logo-branco.svg", svg("#FFFFFF", "#F2353D", "Bruplast - Tudo em embalagens plásticas lisas e impressas"));
console.log("viewBox", vb, "razão", ((maxX - minX) / (maxY - minY)).toFixed(3));
