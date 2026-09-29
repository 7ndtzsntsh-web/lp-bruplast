// Gera as imagens do site (WebP) a partir dos originais em build/originais/.
// Rodar com o sharp disponível: node build/imagens.cjs
// As fotos dos trabalhos vêm do Instagram da própria Bruplast (@bruplast); alimentos.jpg e gelo.jpg vieram no site
// entregue ao dono. cosh-gerada-por-ia.jpg NÃO é usada: é uma versão refeita por IA (o texto da sacola saiu inventado).
const sharp = require("sharp");
const path = require("path");
const O = path.join(__dirname, "originais");
const D = path.join(__dirname, "..", "img");

// [saída, original, tirar borda branca/preta?, posição do corte, cor de fundo para caber inteira (sem cortar)]
const FOTOS = [
  ["trabalho-cosh", "instagram/p01_BIF1IuhDUkT.jpg", false, "centre"],
  ["trabalho-fino-bambino", "instagram/p03__XVGbHEduT.jpg", true, "centre"],
  ["trabalho-sul-modas", "instagram/p04__R_v0AEdgP.jpg", true, "centre"],
  ["trabalho-euphoria", "instagram/p05_-4PQwkEdls.jpg", true, "centre"],
  ["trabalho-boutiques", "instagram/p08_8f3qfQkdp0.jpg", true, "centre", { r: 34, g: 28, b: 32 }],
  ["trabalho-fenarreco", "instagram/p07_9BsJqZkdum.jpg", false, "centre"],
  ["trabalho-alimentos", "alimentos.jpg", false, "centre"],
  ["trabalho-gelo", "gelo.jpg", false, "centre"],
];

(async () => {
  for (const [nome, orig, aparar, pos, fundo] of FOTOS) {
    let img = sharp(path.join(O, orig));
    if (aparar) img = sharp(await img.trim({ threshold: 40 }).toBuffer());
    const meta = await img.metadata();
    const base = await img.toBuffer();
    for (const w of [640, 400]) {
      if (w > meta.width) continue;
      const h = Math.round((w * 3) / 4);
      await sharp(base).resize(w, h, fundo ? { fit: "contain", background: fundo } : { fit: "cover", position: pos }).webp({ quality: 80 }).toFile(path.join(D, `${nome}-${w}.webp`));
    }
    console.log(nome, `${meta.width}x${meta.height}`);
  }
  // Matéria do jornal Município Dia a Dia (23/09/2015) sobre o projeto Cata Caca: só o título e o começo do texto.
  const jornal = await sharp(path.join(O, "instagram/p09_7-S7RCkdun.jpg")).extract({ left: 200, top: 600, width: 560, height: 420 }).toBuffer();
  for (const w of [640, 400]) {
    await sharp(jornal).resize(w, Math.round((w * 3) / 4)).webp({ quality: 80 }).toFile(path.join(D, `jornal-cata-caca-${w}.webp`));
  }
  console.log("jornal-cata-caca");
})();
