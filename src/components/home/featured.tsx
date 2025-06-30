import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardFooter } from '@/components/ui/card';
import FormattedDate from '@/components/FormattedDate';
import Link from '../ui/link';

export default function FeaturedArticles({ featuredPosts }) {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h3 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          { featuredPosts.map((post, index) => (
            <Link href={`/${post.id}`} className={`${index === 0 ? 'col-span-1 md:col-span-2' : 'col-span-1'}`} key={post.id}>
              <Card
                key={index}
                className={'bg-white border-gray-200 shadow-lg overflow-hidden hover:bg-gray-100 transition-all duration-300 group h-full'}
              >
                <div className={index === 0 ? 'md:flex' : ''}>
                  <div className={index === 0 ? 'md:w-1/2' : ''}>
                    <img
                      src={post.data.heroImage || '/placeholder.svg'}
                      alt={post.data.title}
                      width={index === 0 ? 800 : 400}
                      height={index === 0 ? 400 : 300}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${index === 0 ? 'h-68 md:h-full' : 'h-48'
                      }`}
                    />
                  </div>
                  <div className={index === 0 ? 'md:w-1/2 p-8 mb-4' : 'p-6'}>
                    <Badge className="bg-violet-600/20 text-violet-600 border-violet-600/30 mb-4">
                      { post.data.category }
                    </Badge>
                    <div className="flex items-center gap-1 w-full flex-wrap mb-4">
                      { post.data.tags.map((tag) => (
                        <Badge key={tag} className="bg-orange-600/20 text-violet-600 border-orange-600/30">
                          { tag }
                        </Badge>
                      )) }
                    </div>
                    <h4
                      className={`font-bold text-gray-900 mb-4 hover:text-violet-400 transition-colors cursor-pointer ${index === 0 ? 'text-2xl' : 'text-xl'
                      }`}
                    >
                      { post.data.title }
                    </h4>
                    <p className={`text-gray-600 mb-6 leading-relaxed ${index === 0 ? 'text-base' : 'text-sm line-clamp-3'}`}>
                      { post.data.excerpt }
                    </p>
                    <CardFooter className="w-full px-0">
                      <div className="flex items-center justify-between text-sm text-gray-500 w-full">
                        <span>{ post.data.author }</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <FormattedDate date={post.data.pubDate}></FormattedDate>
                        </div>
                      </div>
                    </CardFooter>

                  </div>
                </div>
              </Card>
            </Link>
          )) }
        </div>
      </div>
    </section>

  );
}