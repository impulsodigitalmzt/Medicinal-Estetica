from playwright.sync_api import sync_playwright
from pathlib import Path
import json
import re
import time

out = Path(__file__).resolve().parent
url = (
    "https://www.google.com/maps/place/Dr.+Andr%C3%A9s+Osuna+Lizarraga/"
    "@23.2355625,-106.3880625,17z/data=!4m8!3m7!1s0x869f5306600f4c77:0x41c69c6a9ff9a358"
    "!8m2!3d23.2355625!4d-106.3880625!9m1!1b1?hl=es-MX&entry=ttu"
)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        locale="es-MX",
        geolocation={"latitude": 23.2355625, "longitude": -106.3880625},
        permissions=["geolocation"],
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        ),
        viewport={"width": 1400, "height": 900},
    )
    page = context.new_page()
    page.goto(url, wait_until="domcontentloaded", timeout=90000)

    # Consent banners
    for label in [
        "Aceptar todo",
        "Accept all",
        "Tout accepter",
        "Acepto",
        "Reject all",
        "Rechazar todo",
    ]:
        try:
            btn = page.get_by_role("button", name=re.compile(label, re.I))
            if btn.count() and btn.first.is_visible(timeout=1500):
                btn.first.click(timeout=2000)
                time.sleep(1)
        except Exception:
            pass

    time.sleep(4)
    page.screenshot(path=str(out / "maps_ss1.png"), full_page=False)

    # Try click Opiniones / Reviews tab
    for name in ["Opiniones", "Reviews", "Reseñas"]:
        try:
            tab = page.get_by_role("tab", name=re.compile(name, re.I))
            if tab.count():
                tab.first.click(timeout=3000)
                time.sleep(2)
                break
            btn = page.get_by_role("button", name=re.compile(name, re.I))
            if btn.count():
                btn.first.click(timeout=3000)
                time.sleep(2)
                break
        except Exception:
            pass

    # Also click rating stars link if present
    try:
        page.locator('button[jsaction*="pane.rating.moreReviews"]').first.click(timeout=3000)
        time.sleep(2)
    except Exception:
        pass
    try:
        page.locator('a[href*="lrd="]').first.click(timeout=3000)
        time.sleep(2)
    except Exception:
        pass

    page.screenshot(path=str(out / "maps_ss2.png"), full_page=False)

    # Scroll reviews panel
    for _ in range(8):
        page.mouse.wheel(0, 1800)
        time.sleep(0.6)

    # Collect review-like text nodes
    data = page.evaluate(
        """() => {
      const result = {
        title: document.title,
        heading: document.querySelector('h1')?.innerText || null,
        ratingText: null,
        reviewCountText: null,
        reviews: [],
        bodySnippet: document.body?.innerText?.slice(0, 4000) || ''
      };
      const all = Array.from(document.querySelectorAll('*'));
      for (const el of all) {
        const t = (el.innerText || '').trim();
        if (!t) continue;
        if (/^\\d[,.]\\d$/.test(t) && !result.ratingText) result.ratingText = t;
        if (/opiniones|reviews/i.test(t) && t.length < 40 && !result.reviewCountText) {
          result.reviewCountText = t;
        }
      }
      // Common review containers
      const cards = document.querySelectorAll('[data-review-id], .jftiEf, .fontBodyMedium');
      const seen = new Set();
      for (const card of document.querySelectorAll('[data-review-id], .jftiEf')) {
        const text = (card.innerText || '').trim();
        if (text.length > 40 && !seen.has(text)) {
          seen.add(text);
          result.reviews.push(text.slice(0, 800));
        }
      }
      return result;
    }"""
    )

    (out / "maps_reviews.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps({k: data[k] for k in data if k != "bodySnippet"}, ensure_ascii=False, indent=2)[:4000])
    print("\n--- BODY SNIPPET ---\n")
    print(data.get("bodySnippet", "")[:3500])
    browser.close()
