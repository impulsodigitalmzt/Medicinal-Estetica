from playwright.sync_api import sync_playwright
from pathlib import Path
import json
import re
import time

out = Path(__file__).resolve().parent

# Direct search URL with reviews drawer (same as user link)
search_url = (
    "https://www.google.com/search?q=clinica+dr+andres+osuna+lizarraga"
    "&hl=es-MX&gl=mx#lrd=0x869f5306600f4c77:0x41c69c6a9ff9a358,1,,,,"
)

maps_url = (
    "https://www.google.com/maps?cid=4739647639618429784&hl=es-MX"
)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        locale="es-MX",
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        ),
        viewport={"width": 1440, "height": 960},
    )
    page = context.new_page()

    def handle_consent(pg):
        for sel in [
            'button:has-text("Aceptar todo")',
            'button:has-text("Accept all")',
            'button:has-text("Tout accepter")',
            'form[action*="consent"] button',
            "#L2AGLb",
        ]:
            try:
                loc = pg.locator(sel)
                if loc.count() and loc.first.is_visible(timeout=1200):
                    loc.first.click(timeout=2000)
                    time.sleep(1.5)
                    return True
            except Exception:
                pass
        return False

    # 1) Search page with lrd reviews drawer
    page.goto(search_url, wait_until="domcontentloaded", timeout=90000)
    handle_consent(page)
    time.sleep(3)
    # fragment may need reload after consent
    page.goto(search_url, wait_until="networkidle", timeout=90000)
    time.sleep(4)
    page.screenshot(path=str(out / "search_ss1.png"), full_page=False)

    # Click "Google reseñas" / Opiniones if needed
    for txt in [
        "Opiniones de Google",
        "Google reviews",
        "opiniones",
        "Ver todas las opiniones de Google",
        "Ver opiniones",
    ]:
        try:
            el = page.get_by_text(re.compile(txt, re.I)).first
            if el.is_visible(timeout=1500):
                el.click(timeout=2000)
                time.sleep(2)
        except Exception:
            pass

    page.screenshot(path=str(out / "search_ss2.png"), full_page=False)

    search_text = page.inner_text("body")
    (out / "search_body.txt").write_text(search_text, encoding="utf-8")
    print("=== SEARCH BODY (truncated) ===")
    print(search_text[:5000])

    # 2) Maps by CID
    page.goto(maps_url, wait_until="domcontentloaded", timeout=90000)
    handle_consent(page)
    time.sleep(5)
    page.screenshot(path=str(out / "cid_ss1.png"), full_page=False)
    # Wait for place title
    try:
        page.wait_for_selector("h1", timeout=15000)
    except Exception:
        pass
    time.sleep(2)
    # Click opiniones
    for txt in ["Opiniones", "Reviews"]:
        try:
            page.get_by_role("tab", name=re.compile(txt, re.I)).first.click(timeout=3000)
            time.sleep(2)
            break
        except Exception:
            try:
                page.get_by_text(re.compile(r"^" + txt, re.I)).first.click(timeout=3000)
                time.sleep(2)
                break
            except Exception:
                pass

    for _ in range(10):
        page.mouse.wheel(0, 1600)
        time.sleep(0.5)

    page.screenshot(path=str(out / "cid_ss2.png"), full_page=False)
    maps_text = page.inner_text("body")
    (out / "cid_body.txt").write_text(maps_text, encoding="utf-8")
    print("\n=== MAPS BODY (truncated) ===")
    print(maps_text[:5000])

    # Extract review cards with data-review-id
    reviews = page.evaluate(
        """() => {
      const out = [];
      for (const el of document.querySelectorAll('[data-review-id]')) {
        out.push({
          id: el.getAttribute('data-review-id'),
          text: (el.innerText || '').trim().slice(0, 1200)
        });
      }
      // fallback: look for aria labels with stars
      const aria = [];
      for (const el of document.querySelectorAll('[aria-label*="estrellas"], [aria-label*="stars"]')) {
        aria.push(el.getAttribute('aria-label'));
      }
      return {reviews: out, aria, h1: document.querySelector('h1')?.innerText || null};
    }"""
    )
    (out / "cid_reviews.json").write_text(
        json.dumps(reviews, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("\n=== STRUCTURED ===")
    print(json.dumps(reviews, ensure_ascii=False, indent=2)[:4000])
    browser.close()
