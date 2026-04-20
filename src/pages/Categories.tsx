import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import BlogCard from "@/components/blog/BlogCard";
import { useCategories, useBlogsPerCategory } from "@/hooks/useApi";
import { ArrowRight, TrendingUp, Loader2 } from "lucide-react";

// -- Utilities --
const slugify = (str) =>
    str?.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");

const Categories = () => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // --- API hooks
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();
  const {
    data: blogsPerCategoryResponse = {},
    isLoading: isLoadingBlogsPerCategory,
    error: blogsPerCategoryError,
  } = useBlogsPerCategory();

  // --- Normalize categories
  const categoriesList = Array.isArray(categories) ? categories : [];

  // --- Normalize blogsPerCategoryArr
  let blogsPerCategoryArr = [];
  if (Array.isArray(blogsPerCategoryResponse.data)) {
    blogsPerCategoryArr = blogsPerCategoryResponse.data;
  } else if (
      blogsPerCategoryResponse.data &&
      typeof blogsPerCategoryResponse.data === "object"
  ) {
    blogsPerCategoryArr = Object.values(blogsPerCategoryResponse.data);
  }

  // --- Filter logic
  const filteredBlogsPerCategoryArr =
      selectedCategoryFilter === "all"
          ? blogsPerCategoryArr
          : blogsPerCategoryArr.filter((cat) => {
              return (
                  slugify(cat.category) === selectedCategoryFilter ||
                  cat.categoryId === selectedCategoryFilter ||
                  cat.category === selectedCategoryFilter
              );
          });

  // --- UI: Debug (optional for troubleshooting)
  // console.log({ blogsPerCategoryArr, filteredBlogsPerCategoryArr, selectedCategoryFilter });

  return (
      <Layout>
        <SEOHead />
        {/* Header */}
        <section className="bg-secondary/30 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Browse by Category</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Find the perfect income strategy that matches your skills, interests, and available time. Each category contains detailed guides and proven methods.
              </p>
            </div>
          </div>
        </section>
        {/* Category Filter Dropdown */}
        <section className="py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="w-full sm:w-64">
                <Select
                    value={selectedCategoryFilter}
                    onValueChange={setSelectedCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesList.map((category) => (
                        <SelectItem
                            key={
                              category.slug
                                  ? category.slug
                                  : slugify(category.name)
                            }
                            value={
                              category.slug
                                  ? category.slug
                                  : slugify(category.name)
                            }
                        >
                          {category.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  <TrendingUp className="h-3 w-3 mr-1" /> Most Popular
                </Badge>
                <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  Beginner Friendly
                </Badge>
                <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  High Income Potential
                </Badge>
                <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  Quick Start
                </Badge>
              </div>
            </div>
          </div>
        </section>
        {/* Categories Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoadingCategories || isLoadingBlogsPerCategory ? (
                <div className="text-center py-16">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-lg">Loading categories...</span>
                  </div>
                </div>
            ) : categoriesError || blogsPerCategoryError ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold mb-2">
                    Error loading categories
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Please try again later
                  </p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            ) : (
                <>
                  {filteredBlogsPerCategoryArr.length === 0 ? (
                      <div className="text-center py-16">
                        <p className="text-muted-foreground">
                          No categories or articles found.
                        </p>
                      </div>
                  ) : (
                      <div className="space-y-16">
                        {filteredBlogsPerCategoryArr.map((categoryObj) => (
                            <div key={categoryObj.categoryId} className="space-y-8">
                              {/* Category Header */}
                              <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
                                <div>
                                  <h2 className="text-3xl font-bold mb-2">
                                    {categoryObj.category}
                                  </h2>
                                  <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-muted-foreground">
                            <span>
                              {categoryObj.totalBlogs} articles
                            </span>
                                    <span>•</span>
                                    <span>Updated regularly</span>
                                  </div>
                                </div>
                                {categoryObj.totalBlogs > 3 && (
                                    <div className="mt-6 lg:mt-0 flex gap-2">
                                      <Button asChild>
                                        <Link
                                            to={`/blog?category=${categoryObj.categoryId}`}
                                        >
                                          View All {categoryObj.category}
                                        </Link>
                                      </Button>
                                    </div>
                                )}
                              </div>
                              {/* Category Posts Preview */}
                              {categoryObj.blogs && categoryObj.blogs.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {categoryObj.blogs.map((post) => {
                                      const postWithCategory = {
                                        ...post,
                                        category:
                                            typeof post.category === "object" &&
                                            post.category !== null
                                                ? post.category
                                                : { name: categoryObj.category },
                                      };
                                      return (
                                          <BlogCard
                                              key={post._id}
                                              post={postWithCategory}
                                          />
                                      );
                                    })}
                                  </div>
                              ) : (
                                  <div className="text-center py-8">
                                    <p className="text-muted-foreground">
                                      No articles found in this category yet.
                                    </p>
                                  </div>
                              )}
                              {/* Divider */}
                              <div className="border-t border-border"></div>
                            </div>
                        ))}
                      </div>
                  )}
                </>
            )}
          </div>
        </section>
        {/* Call to Action */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Use our search feature to find specific topics or strategies, or contact us with your questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
              >
                <Link to="/search">Search Articles</Link>
              </Button>
              <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
  );
};

export default Categories;
