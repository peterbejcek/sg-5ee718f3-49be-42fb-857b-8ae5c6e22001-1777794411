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

  const onSubmit = (data: BookingFormData) => {
    console.log("Booking data:", data);
    if (data.priceEstimateOnly) {
      alert("Pošleme vám cenovú kalkuláciu na email/telefón.");
    } else {
      alert("Objednávka odoslaná! Zavoláme vám na potvrdenie.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 shadow-xl"
    >
      <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-6">
        Objednať taxík online
      </h2>

      <div className="space-y-4 sm:space-y-5">
        <div>
          <Label htmlFor="pickup" className="flex items-center gap-2 mb-2 text-base sm:text-lg">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Odkiaľ <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pickup"
            {...register("pickup")}
            placeholder="Napr. Hlavná 1, Košice"
            className="h-12 sm:h-14 text-base sm:text-lg"
          />
          {errors.pickup && (
            <p className="text-sm sm:text-base text-destructive mt-1">
              {errors.pickup.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="destination" className="flex items-center gap-2 mb-2 text-base sm:text-lg">
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Kam <span className="text-destructive">*</span>
          </Label>
          <Input
            id="destination"
            {...register("destination")}
            placeholder="Napr. Letisko Košice"
            className="h-12 sm:h-14 text-base sm:text-lg"
          />
          {errors.destination && (
            <p className="text-sm sm:text-base text-destructive mt-1">
              {errors.destination.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="datetime" className="flex items-center gap-2 mb-2 text-base sm:text-lg">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Kedy <span className="text-destructive">*</span>
          </Label>
          <Input
            id="datetime"
            type="datetime-local"
            {...register("datetime")}
            className="h-12 sm:h-14 text-base sm:text-lg"
          />
          {errors.datetime && (
            <p className="text-sm sm:text-base text-destructive mt-1">
              {errors.datetime.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="passengers" className="flex items-center gap-2 mb-2 text-base sm:text-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Počet osôb
            </Label>
            <Select
              value={passengers}
              onValueChange={(value) => setValue("passengers", value)}
            >
              <SelectTrigger className="h-12 sm:h-14 text-base sm:text-lg">
                <SelectValue placeholder="Vyberte" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()} className="text-base sm:text-lg">
                    {num} {num === 1 ? "osoba" : num < 5 ? "osoby" : "osôb"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="luggage" className="flex items-center gap-2 mb-2 text-base sm:text-lg">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Batožina
            </Label>
            <Input
              id="luggage"
              {...register("luggage")}
              placeholder="Napr. 2 kufre"
              className="h-12 sm:h-14 text-base sm:text-lg"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="flightNumber" className="flex items-center gap-2 mb-2 text-base sm:text-lg">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Číslo letu
          </Label>
          <Input
            id="flightNumber"
            {...register("flightNumber")}
            placeholder="Napr. FR1234"
            className="h-12 sm:h-14 text-base sm:text-lg"
          />
        </div>

        <div>
          <Label htmlFor="note" className="mb-2 block text-base sm:text-lg">
            Poznámka
          </Label>
          <Textarea
            id="note"
            {...register("note")}
            placeholder="Napr. detská sedačka, výmena kontaktu..."
            className="min-h-[100px] sm:min-h-[120px] text-base sm:text-lg resize-none"
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
            className="text-sm sm:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Len cenová kalkulácia (nezáväzné)
          </label>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          type="submit"
          size="lg"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold h-14 sm:h-16 text-base sm:text-lg"
        >
          {priceEstimateOnly ? "Získať cenovú ponuku" : "Objednať taxík"}
        </Button>
        <a href="tel:+421911606206" className="flex-1">
          <Button
            type="button"
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold h-14 sm:h-16 text-base sm:text-lg"
          >
            <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Zavolať
          </Button>
        </a>
      </div>
    </form>
  );
}