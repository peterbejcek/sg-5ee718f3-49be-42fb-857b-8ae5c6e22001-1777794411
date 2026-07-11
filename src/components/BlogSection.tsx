import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export function BlogSection() {
  const { t } = useTranslation();

  useEffect(() => {
    // Clean up any existing script to avoid duplicates
    const existingScript = document.querySelector('script[src*="trysoro.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append the Soro blog script
    const script = document.createElement("script");
    script.src = "https://app.trysoro.com/api/embed/72e345cc-26ab-4fa7-90c3-2a16001d07d4";
    script.defer = true;
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      const soroScript = document.querySelector('script[src*="trysoro.com"]');
      if (soroScript) {
        soroScript.remove();
      }
    };
  }, []);

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            {t.blogSection.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.blogSection.subtitle}
          </p>
        </div>

        <div id="soro-blog"></div>
      </div>
    </section>
  );
}
