import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getLangFromPathname(pathname: string) {
  const [, lang] = pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getRoutePrefixForLang(lang: keyof typeof ui): string {
  if (lang === defaultLang) {
    return '';
  }
  return `/${lang}`;
}


export function useTranslations(lang: keyof typeof ui) {
  return function t<T = string>(
    key: keyof typeof ui[typeof defaultLang],
    vars?: Record<string, any>,
  ): T | string | undefined {
    const raw = ui[lang][key] ?? ui[defaultLang][key];

    if (typeof raw === 'string' && vars) {
      return raw.replace(/{(.*?)}/g, (_, varName) => vars[varName] ?? `{${varName}}`);
    }

    return raw as T;
  };
}