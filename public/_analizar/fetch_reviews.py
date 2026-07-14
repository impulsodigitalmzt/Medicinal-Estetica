import re
import urllib.request
from pathlib import Path

hi = 0x869F5306600F4C77
lo = 0x41C69C6A9FF9A358
out = Path(__file__).resolve().parent

headers = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "es-MX,es;q=0.9",
    "Referer": "https://www.google.com/maps",
    "Cookie": "CONSENT=YES+; SOCS=CAISHAgCEhJnd3NfMjAyMzA4MTAtMF9SQzIaAmVuIAEaBgiA_LWmBg",
}

pb = f"!1m2!1y{hi}!2y{lo}!2m2!1i0!2i40!3e1!4m5!3b1!4b1!5b1!6b1!7b1!5m2!1s!7e81"
url = (
    "https://www.google.com/maps/preview/review/listentitiesreviews"
    f"?hl=es-MX&gl=mx&pb={pb}"
)
print("GET", url)

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=30) as r:
    raw = r.read().decode("utf-8", "replace")

(out / "reviews_raw.txt").write_text(raw, encoding="utf-8")
print("len", len(raw), "start", raw[:100].replace("\n", " "))

body = raw
prefix = ")]}'\n"
if body.startswith(prefix):
    body = body[len(prefix) :]
elif body.startswith(")]}'"):
    body = body[4:].lstrip("\n")

texts = re.findall(r"\"((?:[^\"\\]|\\.){20,1000})\"", body)
print("quoted", len(texts))
kw = re.compile(
    r"(atenci|recomiend|excelente|doctor|botox|trato|consulta|profesional|"
    r"cl[ií]nica|amigable|resultado|labios|filler|servicio|calidad)",
    re.I,
)
for t in texts:
    if kw.search(t):
        print("REV:", t.replace("\\n", " | ")[:400])
        print("---")

# Also dump human-readable unicode escapes loosely
readable = body.encode("utf-8", "replace").decode("unicode_escape", "replace")
(out / "reviews_readable.txt").write_text(readable[:200000], encoding="utf-8", errors="replace")
print("saved readable")
