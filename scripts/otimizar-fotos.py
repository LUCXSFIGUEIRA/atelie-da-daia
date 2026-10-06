"""
Converte as fotos de img/ (PNG ou JPG) para WebP em public/img/.

Uso:  python scripts/otimizar-fotos.py
Requer: pip install pillow

- Mantém o mesmo nome do arquivo (vestido_3.png -> vestido_3.webp).
- Limita o lado maior a 1800 px (fotos originais de celular ficam nítidas em telas retina).
- Aplica nitidez leve e qualidade alta para não perder textura de tecido.
- No fim, imprime largura e altura de cada foto: se mudar, atualize src/data/photos.ts.
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "img"
OUT = ROOT / "public" / "img"
MAX_SIDE = 1800
QUALITY = 90

OUT.mkdir(parents=True, exist_ok=True)
total = 0
for f in sorted(SRC.iterdir()):
    if f.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp", ".heic"}:
        continue
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
    im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=2))
    dest = OUT / f"{f.stem}.webp"
    im.save(dest, "WEBP", quality=QUALITY, method=6)
    total += dest.stat().st_size
    print(f"{f.stem:20s} {im.width}x{im.height}  {dest.stat().st_size // 1024} KB")
print(f"Total: {total // 1024} KB")
