import { useState } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCountries, Country } from "@/hooks/useCountries";

interface PaymentCountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

const PaymentCountrySelector = ({ selectedCountry, onCountryChange }: PaymentCountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const { countries, loading, error } = useCountries();

  console.log('PaymentCountrySelector - countries:', countries.length, 'loading:', loading, 'error:', error);

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Select Your Country
        </label>
        <Button variant="outline" className="w-full justify-center" disabled>
          Loading countries...
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Select Your Country *
        </label>
        <div className="text-sm text-muted-foreground mb-2">
          Country selection is required for payment processing
        </div>
        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={() => window.location.reload()}
        >
          Error loading countries - click to refresh
        </Button>
      </div>
    );
  }

  console.log('PaymentCountrySelector - rendering with countries:', countries.length);

  console.log('PaymentCountrySelector - rendering dropdown, countries:', countries.length, 'open:', open);

  console.log('PaymentCountrySelector - rendering with open:', open, 'countries:', countries.length);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Select Your Country *
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            onClick={() => {
              console.log('PaymentCountrySelector - trigger clicked, current open:', open, 'setting to:', !open);
              setOpen(!open);
            }}
          >
            {selectedCountry || "Select country..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search countries..." />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.length > 0 ? countries.map((country) => {
                  console.log('PaymentCountrySelector - rendering country:', country.name.common);
                  const currencySymbol = Object.values(country.currencies || {})[0]?.symbol || '';
                  return (
                    <CommandItem
                      key={country.cca2}
                      value={country.name.common}
                      onSelect={() => {
                        console.log('PaymentCountrySelector - selected country:', country.name.common);
                        onCountryChange(country.name.common);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCountry === country.name.common ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <img
                        src={country.flags.png}
                        alt={`${country.name.common} flag`}
                        className="mr-2 h-4 w-6 object-cover rounded-sm"
                        onError={(e) => {
                          console.log('PaymentCountrySelector - flag failed for:', country.name.common);
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/24x16?text=🏳️';
                        }}
                      />
                      <span className="flex-1">{country.name.common}</span>
                      {currencySymbol && <span className="text-muted-foreground">{currencySymbol}</span>}
                    </CommandItem>
                  );
                }) : (
                  <CommandItem disabled>No countries available</CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PaymentCountrySelector;