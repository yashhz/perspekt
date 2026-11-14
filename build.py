"""Build index.html from src/index.src.html.

The source keeps the logo out of the HTML: it is read from assets/logo-mask.png
and embedded as a data URI, so the built page is a single self-contained file.

    python3 build.py
"""
import base64
from pathlib import Path

root = Path(__file__).parent
src = (root / 'src' / 'index.src.html').read_text(encoding='utf-8')
logo = base64.b64encode((root / 'assets' / 'logo-mask.png').read_bytes()).decode()

head = (
    '<!doctype html>\n<html lang="en">\n<head>\n'
    '<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    '<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
)
page = head + src.replace('__LOGO__', logo) + '\n</html>\n'
(root / 'index.html').write_text(page, encoding='utf-8')
print('built index.html', len(page), 'bytes')
