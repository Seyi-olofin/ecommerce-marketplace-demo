import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { paymentMethods, PaymentMethod } from "@/lib/paymentMethods";
import { Eye } from "lucide-react";

interface PaymentMethodsListProps {
  selectedCountry: string;
  selectedMethod: string | null;
  onMethodSelect: (method: PaymentMethod) => void;
  onShowAll: () => void;
}

const PaymentMethodsList = ({
  selectedCountry,
  selectedMethod,
  onMethodSelect,
  onShowAll
}: PaymentMethodsListProps) => {
  // Filter methods based on selected country
  const availableMethods = selectedCountry
    ? paymentMethods.filter(method =>
        method.supportedCountries.includes(selectedCountry) ||
        method.supportedCountries.includes('Global')
      )
    : paymentMethods.slice(0, 6); // Show first 6 if no country selected

  const unavailableMethods = selectedCountry
    ? paymentMethods.filter(method =>
        !method.supportedCountries.includes(selectedCountry) &&
        !method.supportedCountries.includes('Global')
      )
    : [];

  const handleMethodClick = (method: PaymentMethod) => {
    if (selectedCountry && !method.supportedCountries.includes(selectedCountry) && !method.supportedCountries.includes('Global')) {
      return; // Don't allow selection of unavailable methods
    }
    onMethodSelect(method);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Available Payment Methods</h3>
        <Button variant="outline" size="sm" onClick={onShowAll}>
          <Eye className="h-4 w-4 mr-2" />
          See all payment methods
        </Button>
      </div>

      {!selectedCountry && (
        <p className="text-sm text-muted-foreground">
          Select your country to see region-specific payment options.
        </p>
      )}

      <div className="grid gap-3">
        {availableMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          return (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleMethodClick(method)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{method.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {method.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {unavailableMethods.length > 0 && (
          <>
            <div className="text-sm font-medium text-muted-foreground mt-4">
              Not available in {selectedCountry}
            </div>
            {unavailableMethods.slice(0, 3).map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.id} className="opacity-50 cursor-not-allowed">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{method.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {method.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsList;