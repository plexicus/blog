
export async function processStaticPaths({pages}) {
    const paths = pages.map(page => {
        if (!page.id.includes('/')) {
            return { params: { slug: page.id || undefined }, props: page };
        }
        const [lang, ...slug] = page.id.split('/');
        return { params: { lang, slug: slug.join('/') || undefined }, props: page };
    });
    return paths;
}