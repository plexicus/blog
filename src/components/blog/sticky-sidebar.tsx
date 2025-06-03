
import ShareButtons from './share-buttons';
import TableOfContents from './table-of-contents';
export default function StickySidebar() {
  return (
    <section className="sticky top-16 py-2">
      <div className="space-y-6">
        { /* Share Buttons */ }
        
        <ShareButtons title="article" url="eko" />

        { /* Table of Contents */ }
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Table of Contents</h3>
          <TableOfContents />
        </div>
      </div>
    </section>
  );
}
