import { motion } from "framer-motion";
import { reviews, reviewsData } from "@/data/reviews";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Quote } from "lucide-react";

export function ReviewsSection() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <motion.section 
      id="recenzie" 
      className="py-16 sm:py-20 bg-background"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            {reviewsData.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {reviewsData.subtitle}
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(5)}</div>
              <span className="font-display font-bold text-2xl">
                {reviewsData.averageRating}
              </span>
            </div>
            <div className="text-muted-foreground">
              {reviewsData.totalReviews}+ recenzií
            </div>
          </div>

          <a href={reviewsData.googleProfileUrl} target="_blank" rel="noopener noreferrer">
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Zobraziť všetky recenzie na Google
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
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
          {reviews.slice(0, 3).map((review, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-lg p-6 shadow-lg relative"
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                show: { opacity: 1, scale: 1 }
              }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-1">
                        {review.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("sk-SK", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                    <Quote className="w-8 h-8 text-primary/20" />
                  </div>

                  <div className="flex mb-4">{renderStars(review.rating)}</div>

                  {review.service && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {review.service}
                      </span>
                    </div>
                  )}

                  <p className="text-foreground/80 leading-relaxed flex-grow">
                    {review.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Google Reviews Link */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a 
            href="https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-foreground font-semibold px-6 py-3 rounded-lg border border-border shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Viac recenzií na Google
          </a>
          <p className="text-sm text-muted-foreground mt-3">
            Prečítajte si {reviewsData.totalReviews}+ recenzií od našich spokojných zákazníkov
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}