"use client"

import { Search, Calendar, Clock, ArrowRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { useState, useMemo } from "react" // Import useMemo
import FormattedDate from "@/components/FormattedDate";
import Link from "../ui/link"

const POSTS_PER_PAGE = 3; // Define posts per page

export default function BlogHomepage({ featuredPosts, blogPosts }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categoryPagination, setCategoryPagination] = useState<{[key: string]: number}>({ "All": 1 }); // State for pagination per category

  const filteredBlogPosts =
    selectedCategory === "All" ? blogPosts : blogPosts.filter((post) => post.data.category === selectedCategory)

  const categories = ["All", "Technology", "Architecture", "Security", "Design", "Database", "Infrastructure"]

  // Calculate the posts for the current page of the selected category
  const currentPage = categoryPagination[selectedCategory] || 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
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

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Hero Section */}
        <section className="pb-36 pt-50 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Insights & Innovation</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the latest trends, best practices, and cutting-edge solutions in technology and digital
              transformation.
            </p>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 text-lg">
              Explore Articles
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </div>

      <div className="bg-white">
        {/* Featured Posts */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.map((post, index) => (
                <Link href={`/${post.id}`} className={`${index === 0 ? "col-span-2" : "col-span-1"}`}>
                  <Card
                    key={index}
                    className={`bg-white border-gray-200 shadow-lg overflow-hidden hover:bg-gray-100 transition-all duration-300 group`}
                  >
                    <div className={index === 0 ? "md:flex" : ""}>
                      <div className={index === 0 ? "md:w-1/2" : ""}>
                        <img
                          src={post.data.heroImage || "/placeholder.svg"}
                          alt={post.data.title}
                          width={index === 0 ? 800 : 400}
                          height={index === 0 ? 400 : 300}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${index === 0 ? "h-68 md:h-full" : "h-48"
                            }`}
                        />
                      </div>
                      <div className={index === 0 ? "md:w-1/2 p-8" : "p-6"}>
                        <Badge className="bg-violet-600/20 text-violet-600 border-violet-600/30 mb-4">
                          {post.data.category}
                        </Badge>
                        <h4
                          className={`font-bold text-gray-900 mb-4 hover:text-violet-400 transition-colors cursor-pointer ${index === 0 ? "text-2xl" : "text-xl"
                            }`}
                        >
                          {post.data.title}
                        </h4>
                        <p className={`text-gray-600 mb-6 leading-relaxed ${index === 0 ? "text-base" : "text-sm line-clamp-3"}`}>
                          {post.data.excerpt}
                        </p>
                        <CardFooter className="w-full px-0">
                          <div className="flex items-center justify-between text-sm text-gray-500 w-full">
                            <span>{post.data.author}</span>
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
              ))}
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === selectedCategory ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={
                    category === selectedCategory
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-violet-600/20 hover:text-violet-600 hover:border-violet-600"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedBlogPosts.map((post, index) => (
                <Link href={`/${post.id}`}>
                  <Card
                    key={index}
                    className="bg-white border-gray-200 shadow-lg overflow-hidden hover:bg-gray-100 transition-all duration-300 group cursor-pointer !pt-0 h-full"
                  >
                    <CardHeader className="p-0">
                      <img
                        src={post.data.heroImage || "/placeholder.svg"}
                        alt={post.data.title}
                        width={400}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </CardHeader>
                    <CardContent className="px-6 justify-self-end h-full">
                      <Badge className="bg-violet-600/20 text-violet-600 border-violet-600/30 mb-3">
                        {post.data.category}
                      </Badge>
                      <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-violet-400 transition-colors">
                        {post.data.title}
                      </h4>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">{post.data.excerpt}</p>
                    </CardContent>
                    <CardFooter className="w-full mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 w-full">
                        <span>{post.data.author}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <FormattedDate date={post.data.pubDate}></FormattedDate>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
            {filteredBlogPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found in the "{selectedCategory}" category.</p>
                <Button
                  onClick={() => setSelectedCategory("All")}
                  className="mt-4 bg-violet-600 hover:bg-violet-700 text-white"
                >
                  View All Articles
                </Button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (filteredBlogPosts.length > 0) && (
              <div className="flex justify-end space-x-4 mt-8">
                <Button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                >
                  Previous
                </Button>
                <span className="self-center text-gray-700">Page {currentPage} of {totalPages}</span>
                <Button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Load More */}
        {/* This section can be removed or repurposed if pagination is sufficient */}
        {/*
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3">Load More Articles</Button>
          </div>
        </section>
        */}

        {/* Newsletter Signup */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-8">Get the latest insights and updates delivered directly to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="flex-1 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">Subscribe</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
