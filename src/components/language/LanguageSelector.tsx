import { useEffect, useRef, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { assetUrl } from '../../utils/assetUrl';
import './language.css';

const languages = [
  { code: 'de', flag: 'de', name: 'Deutsch' },
  { code: 'en', flag: 'gb', name: 'English' },
  { code: 'tr', flag: 'tr', name: 'Türkçe' },
  { code: 'pt', flag: 'mz', name: 'Português' },
] as const;
type Language = typeof languages[number]['code'];
const storageKey = 'urfa-language';
function savedLanguage(): Language {
  try {
    const code = localStorage.getItem(storageKey);
    return languages.find(language => language.code === code)?.code ?? 'de';
  } catch { return 'de'; }
}

declare global {
  interface Window {
    urfaTranslateReady?: () => void;
    google?: { translate?: { TranslateElement: new (options: Record<string, unknown>, id: string) => unknown } };
  }
}

let translator: Promise<HTMLSelectElement> | undefined;
function loadTranslator(): Promise<HTMLSelectElement> {
  if (translator) return translator;
  translator = new Promise((resolve, reject) => {
    const host = document.createElement('div');
    host.id = 'urfa-google-translate';
    host.className = 'translation-provider';
    document.body.append(host);
    let poll: ReturnType<typeof setInterval>;
    const fail = () => {
      clearInterval(poll);
      clearTimeout(timeout);
      script.remove();
      host.remove();
      translator = undefined;
      reject(new Error('Translation unavailable'));
    };
    const timeout = setTimeout(fail, 15000);
    window.urfaTranslateReady = () => {
      if (!window.google?.translate) return fail();
      new window.google.translate.TranslateElement({ pageLanguage: 'de', includedLanguages: 'de,en,tr,pt', autoDisplay: false }, host.id);
      poll = setInterval(() => {
        const select = host.querySelector<HTMLSelectElement>('select.goog-te-combo');
        if (!select?.options.length) return;
        clearInterval(poll);
        clearTimeout(timeout);
        resolve(select);
      }, 100);
    };
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=urfaTranslateReady';
    script.async = true;
    script.onerror = fail;
    document.body.append(script);
  });
  return translator;
}

export default function LanguageSelector() {
  const [language, setLanguage] = useState<Language>(savedLanguage);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pending = useRef(false);
  const active = languages.find(item => item.code === language)!;

  async function choose(code: Language) {
    if (pending.current) return;
    setError(false);
    if (code === 'de') {
      try { localStorage.setItem(storageKey, code); } catch { /* Storage may be disabled. */ }
      // Clear both host-only and parent-domain cookies set by the translation provider.
      const domains = [location.hostname, `.${location.hostname}`, `.${location.hostname.split('.').slice(-2).join('.')}`];
      for (const path of ['/', '/urfa-web-app', '/urfa-web-app/']) {
        document.cookie = `googtrans=; Max-Age=0; path=${path}`;
        for (const domain of domains) document.cookie = `googtrans=; Max-Age=0; path=${path}; domain=${domain}`;
      }
      if (language !== 'de') location.reload();
      setOpen(false);
      return;
    }
    pending.current = true;
    setBusy(true);
    try {
      const select = await loadTranslator();
      select.value = code;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      setLanguage(code);
      window.dispatchEvent(new CustomEvent('urfa-language-change', { detail: code }));
      document.documentElement.lang = code === 'pt' ? 'pt-MZ' : code;
      try { localStorage.setItem(storageKey, code); } catch { /* Storage may be disabled. */ }
      setOpen(false);
      trigger.current?.focus();
    } catch { setError(true); setOpen(true); }
    finally { pending.current = false; setBusy(false); }
  }

  useEffect(() => {
    const saved = savedLanguage();
    if (saved !== 'de') void choose(saved);
  }, []);
  useEffect(() => {
    if (!open) return;
    const click = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', click);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', click); document.removeEventListener('keydown', key); };
  }, [open]);

  return <div className="language-selector notranslate" translate="no" ref={root}>
    <button ref={trigger} className="language-trigger" type="button" aria-label="Sprache / Language" aria-expanded={open} aria-controls="language-options" onClick={() => setOpen(value => !value)}>
      <img src={assetUrl(`assets/flags/${active.flag}.svg`)} alt="" width="24" height="17" />
      <span>{active.code.toUpperCase()}</span><CaretDown size={12} />
    </button>
    {open && <div id="language-options" className="language-options" aria-label="Sprache wählen / Choose language">
      {languages.map(item => <button type="button" key={item.code} lang={item.code} aria-pressed={language === item.code} disabled={busy} onClick={() => void choose(item.code)}>
        <img src={assetUrl(`assets/flags/${item.flag}.svg`)} alt="" width="28" height="20" /><span>{item.name}</span>{language === item.code && <span aria-hidden="true">✓</span>}
      </button>)}
      <small>Automatische Übersetzung · Google Translate</small>
      <small>Die Sprachwahl lädt den Google-Dienst.</small>
      {busy && <p role="status">Übersetzung lädt … / Loading …</p>}
      {error && <p role="alert">Übersetzung nicht erreichbar. Bitte erneut versuchen. / Translation unavailable. Please try again.</p>}
    </div>}
  </div>;
}
