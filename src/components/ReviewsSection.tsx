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
    <section id="recenzie" className="py-16 sm:py-20 bg-background">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
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

                <p className="text-foreground/80 leading-relaxed">
                  {review.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Pridajte sa k stovkám spokojných zákazníkov
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#objednavka">
              <Button 
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold"
              >
                Objednať jazdu teraz
              </Button>
            </a>
            <a href="tel:+421911606206">
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-primary border-2 border-primary font-display font-semibold"
              >
                Zavolať +421 911 606 206
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}