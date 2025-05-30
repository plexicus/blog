import { Calendar, Search,X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { useState, useMemo } from 'react'; // Import useMemo
import FormattedDate from '@/components/FormattedDate';
import Link from '../ui/link';
const POSTS_PER_PAGE = 6;
export default function LatestArticles({ blogPosts }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoryPagination, setCategoryPagination] = useState<{ [key: string]: number }>({ 'All': 1 }); // State for pagination per category
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Introduction', 'Tutorial', 'Security', 'Changelog', 'Infrastructure'];

  // Calculate the posts for the current page of the selected category
  const currentPage = categoryPagination[selectedCategory] || 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;


  const filteredBlogPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.data.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.data.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.data.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const paginatedBlogPosts = filteredBlogPosts.slice(startIndex, endIndex);

  // Calculate total pages for the selected category
  const totalPages = Math.ceil(filteredBlogPosts.length / POSTS_PER_PAGE);

  // Handlers for pagination
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCategoryPagination({
        ...categoryPagination,
        [selectedCategory]: currentPage - 1,
      });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCategoryPagination({
        ...categoryPagination,
        [selectedCategory]: currentPage + 1,
      });
    }
  };

  // Reset to first page when category changes
  useMemo(() => {
    setCategoryPagination(prev => ({
      ...prev,
      [selectedCategory]: 1,
    }));
  }, [selectedCategory]);

  const handleSearchSubmit = () => {
    // Search functionality is already handled by the filter above
    console.log('Searching for:', searchQuery);
  };

  const handleSearchToggle = () => {
    if (isSearchOpen && searchQuery) {
      handleSearchSubmit();
    } else {
      setIsSearchOpen(!isSearchOpen);
      if (!isSearchOpen) {
        // Focus the input when opening
        setTimeout(() => {
          const input = document.querySelector('#search-input') as HTMLInputElement;
          input?.focus();
        }, 100);
      } else {
        // Clear search when closing
        setSearchQuery('');
      }
    }
  };
  
  return (
    <div className="bg-white">
      { /* Featured Posts */ }

      { /* Categories Filter with Search */ }
      <section className="py-8 px-4 sticky top-16 bg-white z-40 border-b border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">


            { /* Category Tabs */ }
            <div className="flex flex-wrap gap-3 flex-1">
              { categories.map((category) => (
                <Button
                  key={category}
                  variant={category === selectedCategory ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className={
                    category === selectedCategory
                      ? 'bg-violet-600 hover:bg-violet-700 text-white'
                      : 'border-gray-300 text-gray-600 hover:bg-violet-600/20 hover:text-violet-600 hover:border-violet-600'
                  }
                >
                  { category }
                </Button>
              )) }
            </div>
            { /* Search Button/Input */ }
            <div className="flex items-center gap-2">
              { isSearchOpen && (
                <div className="relative">
                  <Input
                    id="search-input"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit();
                      }
                      if (e.key === 'Escape') {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }
                    }}
                    className="w-64 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-violet-500"
                  />
                  { searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  ) }
                </div>
              ) }
              <Button
                variant="outline"
                size="icon"
                onClick={handleSearchToggle}
                className={`border-gray-300 hover:bg-violet-600/20 hover:border-violet-600 transition-all duration-200 ${
                  isSearchOpen && searchQuery ? 'bg-violet-600 text-white hover:bg-violet-700' : ''
                }`}
              >
                <Search className="w-4 h-4" />
              </Button>

            </div>
          </div>
        </div>
      </section>

      { /* Blog Posts Grid */ }
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            { paginatedBlogPosts.map((post, index) => (
              <Link href={`/${post.id}`} key={index}>
                <Card
                  key={index}
                  className="bg-white border-gray-200 shadow-lg overflow-hidden hover:bg-gray-100 transition-all duration-300 group cursor-pointer !pt-0 h-full"
                >
                  <CardHeader className="p-0">
                    <img
                      src={post.data.heroImage || '/placeholder.svg'}
                      alt={post.data.title}
                      width={400}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </CardHeader>
                  <CardContent className="px-6 justify-self-end h-full">
                    <Badge className="bg-violet-600/20 text-violet-600 border-violet-600/30 mb-3">
                      { post.data.category }
                    </Badge>
                    <div className="flex items-center gap-2">
                      { post.data.tags.map((tag) => (
                        <Badge key={tag} className="bg-orange-600/20 text-violet-600 border-orange-600/30 mb-4">
                          { tag }
                        </Badge>
                      )) }
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-violet-400 transition-colors">
                      { post.data.title }
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">{ post.data.excerpt }</p>
                  </CardContent>
                  <CardFooter className="w-full mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 w-full">
                      <span>{ post.data.author }</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <FormattedDate date={post.data.pubDate}></FormattedDate>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            )) }
          </div>
          { filteredBlogPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found in the "{ selectedCategory }" category.</p>
              <Button
                onClick={() => setSelectedCategory('All')}
                className="mt-4 bg-violet-600 hover:bg-violet-700 text-white"
              >
                View All Articles
              </Button>
            </div>
          ) }

          { /* Pagination Controls */ }
          { totalPages > 1 && (filteredBlogPosts.length > 0) && (
            <div className="flex justify-end space-x-4 mt-8">
              <Button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="self-center text-gray-700">Page { currentPage } of { totalPages }</span>
              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          ) }
        </div>
      </section>
    </div>
  );
}