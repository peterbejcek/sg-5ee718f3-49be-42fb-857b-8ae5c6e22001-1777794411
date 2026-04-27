import { motion } from "framer-motion";
import { blogPosts } from "@/data/blog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BlogSection() {
  return (
    <motion.section 
      id="blog" 
      className="py-16 sm:py-20 bg-background"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Blog a novinky
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aktuality, tipy a zaujímavosti zo sveta taxislužieb a mobility
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {blogPosts.slice(0, 3).map((post) => (
            <motion.div
              key={post.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                {post.image && (
                  <div className="h-48 bg-muted overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('sk-SK')}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Čítať viac
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}