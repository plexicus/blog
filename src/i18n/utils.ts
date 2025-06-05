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


// Define a helper type for the parameters object
type PathParams<T extends string> = { locale: string } & { [key in T]?: string };

/**
 * Generates localized paths for Astro's getStaticPaths().
 * Can generate paths based only on locales, or combine locales with additional dynamic slugs.
 *
 * @param options - An object containing either:
 * - `slugs` (optional): An array of strings for an additional dynamic segment (e.g., industry slugs).
 * - `dynamicKey` (optional): The name of the dynamic segment (e.g., 'industry', 'product').
 * @returns An array of path objects suitable for Astro's getStaticPaths().
 */
export function generateLocalizedPaths<T extends string = never, Page = any>(options?: {
  pages?: Page[];
}): { params: PathParams<T>; props: Page }[] { // Use the helper type here and correct props type
  const paths: { params: PathParams<T>; props: Page }[] = []; // Add props to the type definition of paths
  const pages = options?.pages || [undefined]; // Use [undefined] to iterate once if no slugs are provided
  Object.keys(ui).forEach(locale => {
    pages.forEach(page => {
      
      const props = page;
      // Build the params object dynamically to ensure type safety
      const params: PathParams<T> = {
        locale: locale,
      } as PathParams<T>; // Initial assertion for `locale` only

      if (page !== undefined) {
        // Assign the dynamic key-value pair
        const [, ...slug] = page.id.split('/');
        (params as any)['slug'] = page.id; // Temporary `any` here as TypeScript can't infer this dynamic assignment perfectly without a more complex type guard.
        // The `PathParams<T>` type itself already covers the possibility.
      }
      paths.push({ params, props });
    });
  });
  return paths;
}
