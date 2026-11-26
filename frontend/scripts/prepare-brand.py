"""Remove the supplied logo's warm paper field and write compact brand icons.

Requires Pillow (`python -m pip install Pillow`). The source image remains untouched.
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/brand/staywise-logo-source.png"
DESTINATION = ROOT / "src/assets/brand/staywise-logo.png"
WHITE_DESTINATION = ROOT / "src/assets/brand/staywise-logo-white.png"
FAVICON_DIR = ROOT / "public/assets/favicon"


def background_alpha(red: int, green: int, blue: int) -> int:
    """Keep colored/dark artwork and fade neutral, light paper to transparency."""
    mean = (red + green + blue) / 3
    spread = max(red, green, blue) - min(red, green, blue)
    if mean >= 175 and spread <= 46:
        return 0
    return max(0, min(255, int(max(spread * 7, (222 - mean) * 8))))


def main() -> None:
    original = Image.open(SOURCE).convert("RGB")
    pixels = original.load()
    output = Image.new("RGBA", original.size)
    result = output.load()

    for y in range(original.height):
        for x in range(original.width):
            red, green, blue = pixels[x, y]
            alpha = background_alpha(red, green, blue)
            result[x, y] = (red, green, blue, alpha)

    bounds = output.getbbox()
    if bounds is None:
        raise SystemExit("Logo processing removed all visible pixels.")

    artwork = output.crop(bounds)
    artwork.thumbnail((720, 720), Image.Resampling.LANCZOS)
    padding = max(12, round(max(artwork.size) * 0.035))
    padded = Image.new("RGBA", (artwork.width + padding * 2, artwork.height + padding * 2))
    padded.alpha_composite(artwork, (padding, padding))
    padded.save(DESTINATION, optimize=True)
    white_mark = Image.new("RGBA", padded.size, (255, 255, 255, 0))
    white_mark.putalpha(padded.getchannel("A"))
    white_mark.save(WHITE_DESTINATION, optimize=True)

    FAVICON_DIR.mkdir(parents=True, exist_ok=True)
    for size, name in ((16, "favicon-16.png"), (32, "favicon-32.png"),
                       (48, "favicon-48.png"), (180, "apple-touch-icon.png"),
                       (192, "icon-192.png"), (512, "icon-512.png")):
        padded.resize((size, size), Image.Resampling.LANCZOS).save(FAVICON_DIR / name, optimize=True)

    print(f"Prepared transparent logo at {DESTINATION}")
    print(f"Artwork bounds: {artwork.width}x{artwork.height}; favicon variants: 6")


if __name__ == "__main__":
    main()
