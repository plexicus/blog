
export async function processStaticPaths({ pages, lang = 'en' }) {
  const language = lang;
  const paths = pages
    .filter(page => {
      if (language === 'en') {
        // For English, only include pages without a language prefix
        return !page.id.includes('/');
      } else {
        // For other languages, only include pages with the correct language prefix
        return page.id.startsWith(language + '/');
      }
    })
    .map(page => {
      if (language === 'en') {
        // English pages have no prefix
        return { params: { slug: page.id || undefined }, props: page };
      } else {
        // Other language pages have a prefix
        const [langPrefix, ...slug] = page.id.split('/');
        return { params: { lang: langPrefix, slug: slug.join('/') || undefined }, props: page };
      }
    });
  return paths;
}