// PlantECG Internationalization System
// Templates are loaded from /templates directory

const i18n = {
  // Language metadata
  languages: {
    en: { name: "English", flag: "🇬🇧" },
    pl: { name: "Polski", flag: "🇵🇱" },
    ja: { name: "日本語", flag: "🇯🇵" }
  },

  // Navigation translations
  nav: {
    en: { analyzer: "Analyzer", deviceGuide: "Device Guide", about: "About" },
    pl: { analyzer: "Pomiary", deviceGuide: "Opis urządzenia", about: "Opis" },
    ja: { analyzer: "分析ツール", deviceGuide: "使用ガイド", about: "概要" }
  },

  // Index page UI elements
  index: {
    en: { title: "Chlorophyll Fluorescence", heading: "PlantECG fluorometer data processing", selectFiles: "Select CSV files", getResults: "Get results" },
    pl: { title: "Fluorescencja chlorofilu", heading: "Przetwarzanie danych fluorymetru PlantECG", selectFiles: "Wybierz pliki CSV", getResults: "Pobierz wyniki" },
    ja: { title: "クロロフィル蛍光", heading: "PlantECG 蛍光計の測定結果", selectFiles: "CSVファイルを選択", getResults: "結果を取得" }
  },

  // Template cache
  templateCache: {},

  // Get saved language or default to English
  getSavedLanguage() {
    return localStorage.getItem('plantecg-lang') || 'en';
  },

  // Save language preference
  saveLanguage(lang) {
    localStorage.setItem('plantecg-lang', lang);
  },

  // Detect current page
  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('device-guide')) return 'device-guide';
    if (path.includes('about')) return 'about';
    return 'index';
  },

  // Load template from file
  async loadTemplate(page, lang) {
    const cacheKey = `${page}-${lang}`;

    // Return cached template if available
    if (this.templateCache[cacheKey]) {
      return this.templateCache[cacheKey];
    }

    try {
      const response = await fetch(`/templates/${page}-${lang}.html`);
      if (!response.ok) throw new Error('Template not found');
      const html = await response.text();
      this.templateCache[cacheKey] = html;
      return html;
    } catch (error) {
      console.warn(`Failed to load template: ${page}-${lang}`, error);
      // Fallback to English if translation not found
      if (lang !== 'en') {
        return this.loadTemplate(page, 'en');
      }
      return '<p>Content not available.</p>';
    }
  },

  // Update navigation
  updateNav(lang) {
    const nav = this.nav[lang];
    document.querySelectorAll('nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href.includes('index')) link.textContent = nav.analyzer;
      else if (href.includes('device-guide')) link.textContent = nav.deviceGuide;
      else if (href.includes('about')) link.textContent = nav.about;
    });
  },

  // Update index page specific elements
  updateIndexPage(lang) {
    const t = this.index[lang];
    document.title = t.title;

    const heading = document.querySelector('h3');
    if (heading) heading.textContent = t.heading;

    const fileLabel = document.querySelector('label[for="file-input"]');
    if (fileLabel) fileLabel.childNodes[0].textContent = t.selectFiles + ' ';

    const resultsBtn = document.getElementById('download-chart');
    if (resultsBtn) resultsBtn.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;' + t.getResults + '&nbsp;&nbsp;&nbsp;';
  },

  // Apply translations
  async applyTranslations(lang) {
    const page = this.getCurrentPage();

    // Update navigation
    this.updateNav(lang);

    // Update page content
    const contentContainer = document.getElementById('i18n-content');
    if (contentContainer && page !== 'index') {
      const template = await this.loadTemplate(page, lang);
      contentContainer.innerHTML = template;
    }

    // Update index page elements
    if (page === 'index') {
      this.updateIndexPage(lang);
    }

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update dropdown
    const dropdown = document.getElementById('lang-select');
    if (dropdown) dropdown.value = lang;
  },

  // Switch language
  switchLanguage(lang) {
    this.saveLanguage(lang);
    this.applyTranslations(lang);
  },

  // Create language selector
  createLanguageSelector() {
    const nav = document.querySelector('nav');
    if (!nav || document.getElementById('lang-select')) return;

    const selector = document.createElement('div');
    selector.className = 'lang-selector';

    const options = Object.entries(this.languages)
      .map(([code, { name, flag }]) => `<option value="${code}">${flag} ${name}</option>`)
      .join('');

    selector.innerHTML = `<select id="lang-select">${options}</select>`;
    nav.appendChild(selector);

    // Add event listener
    document.getElementById('lang-select').addEventListener('change', (e) => {
      this.switchLanguage(e.target.value);
    });

    // Set initial value
    document.getElementById('lang-select').value = this.getSavedLanguage();
  },

  // Initialize
  init() {
    this.createLanguageSelector();
    this.applyTranslations(this.getSavedLanguage());
  }
};

// Global function for backwards compatibility
function switchLanguage(lang) {
  i18n.switchLanguage(lang);
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', () => i18n.init());
