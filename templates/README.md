# PlantECG Templates

This directory contains HTML templates for each page in each supported language.

## File naming convention

```
{page}-{language-code}.html
```

Examples:
- `device-guide-en.html` - Device Guide in English
- `device-guide-pl.html` - Device Guide in Polish
- `about-ja.html` - About page in Japanese

## Supported languages

| Code | Language | Flag |
|------|----------|------|
| en   | English  | 🇬🇧  |
| pl   | Polski   | 🇵🇱  |
| ja   | 日本語    | 🇯🇵  |

## Adding a new language

1. Create template files: `device-guide-XX.html`, `about-XX.html`
2. Edit `i18n.js` and add entries to:
   - `languages` - language name and flag
   - `nav` - navigation labels
   - `index` - index page UI elements

## Local development

Templates are loaded via `fetch()`, which requires a web server. Opening HTML files directly (file://) won't work.

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000
