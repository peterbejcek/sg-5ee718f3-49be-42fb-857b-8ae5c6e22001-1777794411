import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Navigation, Calendar, Users, Phone, Briefcase, Plane } from "lucide-react";

const bookingSchema = z.object({
  pickup: z.string().min(3, "Zadajte odberné miesto (min. 3 znaky)"),
  destination: z.string().min(3, "Zadajte cieľ (min. 3 znaky)"),
  datetime: z.string().min(1, "Vyberte dátum a čas"),
  passengers: z.string().optional(),
  luggage: z.string().optional(),
  flightNumber: z.string().optional(),
  note: z.string().optional(),
  priceEstimateOnly: z.boolean().default(false),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      priceEstimateOnly: false,
    },
  });

  const passengers = watch("passengers");
  const priceEstimateOnly = watch("priceEstimateOnly");

  const onSubmit = async (data: BookingFormData) => {
    try {
      const response = await fetch("/api/send-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Objednávka bola úspešne odoslaná! Čoskoro vás budeme kontaktovať.");
        form.reset();
      } else {
        alert(`⚠️ ${result.message || "Chyba pri odosielaní objednávky. Zavolajte na +421 911 606 206"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Chyba pri odosielaní objednávky. Zavolajte prosím priamo na +421 911 606 206");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card border border-border rounded-lg p-6 shadow-xl"
    >
      <h2 className="font-display font-bold text-2xl mb-6">
        Objednať taxík online
      </h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="pickup" className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            Odkiaľ <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pickup"
            {...register("pickup")}
            placeholder="Napr. Hlavná 1, Košice"
            className="h-12 text-base"
          />
          {errors.pickup && (
            <p className="text-sm text-destructive mt-1">
              {errors.pickup.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="destination" className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-primary" />
            Kam <span className="text-destructive">*</span>
          </Label>
          <Input
            id="destination"
            {...register("destination")}
            placeholder="Napr. Letisko Košice"
            className="h-12 text-base"
          />
          {errors.destination && (
            <p className="text-sm text-destructive mt-1">
              {errors.destination.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="datetime" className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            Kedy <span className="text-destructive">*</span>
          </Label>
          <Input
            id="datetime"
            type="datetime-local"
            {...register("datetime")}
            className="h-12 text-base"
          />
          {errors.datetime && (
            <p className="text-sm text-destructive mt-1">
              {errors.datetime.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="passengers" className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              Počet osôb
            </Label>
            <Select
              value={passengers}
              onValueChange={(value) => setValue("passengers", value)}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Vyberte" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "osoba" : num < 5 ? "osoby" : "osôb"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="luggage" className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Batožina
            </Label>
            <Input
              id="luggage"
              {...register("luggage")}
              placeholder="Napr. 2 kufre"
              className="h-12 text-base"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="flightNumber" className="flex items-center gap-2 mb-2">
            <Plane className="w-4 h-4 text-primary" />
            Číslo letu
          </Label>
          <Input
            id="flightNumber"
            {...register("flightNumber")}
            placeholder="Napr. FR1234"
            className="h-12 text-base"
          />
        </div>

        <div>
          <Label htmlFor="note" className="mb-2 block">
            Poznámka
          </Label>
          <Textarea
            id="note"
            {...register("note")}
            placeholder="Napr. detská sedačka, výmena kontaktu..."
            className="min-h-[80px] text-base resize-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="priceEstimateOnly"
            checked={priceEstimateOnly}
            onCheckedChange={(checked) =>
              setValue("priceEstimateOnly", checked as boolean)
            }
          />
          <label
            htmlFor="priceEstimateOnly"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Len cenová kalkulácia (nezáväzné)
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          size="lg"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold h-14"
        >
          {priceEstimateOnly ? "Získať cenovú ponuku" : "Objednať taxík"}
        </Button>
        <a href="tel:+421911606206" className="flex-1">
          <Button
            type="button"
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold h-14"
          >
            <Phone className="w-5 h-5 mr-2" />
            Zavolať
          </Button>
        </a>
      </div>
    </form>
  );
}