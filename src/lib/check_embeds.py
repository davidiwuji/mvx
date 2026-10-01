import urllib.request, urllib.error, sys

sources = {
    "VidSrc V2": "https://vidsrc.cc/v2/embed/movie/550",
    "VidPro": "https://player.vidpro.top/embed/movie/550?autoplay=true",
    "VidLink": "https://vidlink.pro/movie/550",
    "VidEasy": "https://player.videasy.net/movie/550",
    "VidRock": "https://vidrock.net/embed/movie/550",
    "VidSrc": "https://vidsrc.to/embed/movie/550",
    "Embed_su": "https://embed.su/embed/movie/550",
    "2Embed": "https://www.2embed.cc/embed/550",
}

for name, url in sources.items():
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
        resp = urllib.request.urlopen(req, timeout=10)
        body = resp.read().decode("utf-8", errors="replace")[:500]
        print(f"{name}: HTTP {resp.status} ({len(body)} bytes)")
        # Check if it contains video/iframe content
        if "iframe" in body.lower() or "video" in body.lower() or "player" in body.lower():
            print("  -> HAS VIDEO PLAYER CONTENT")
        # Check for key patterns
        if "404" in body[:200] or "not found" in body[:200].lower():
            print("  -> 404/NOT FOUND")
        print(f"  Preview: {body[:200]}")
    except Exception as e:
        print(f"{name}: ERROR - {e}")
    print()
