import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { paymentMethods, PaymentMethod } from "@/lib/paymentMethods";
import { X } from "lucide-react";

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMethodSelect: (method: PaymentMethod) => void;
  selectedMethod: string | null;
}

const PaymentMethodsModal = ({
  isOpen,
  onClose,
  onMethodSelect,
  selectedMethod
}: PaymentMethodsModalProps) => {
  const groupedMethods = paymentMethods.reduce((acc, method) => {
    if (!acc[method.type]) {
      acc[method.type] = [];
    }
    acc[method.type].push(method);
    return acc;
  }, {} as Record<string, PaymentMethod[]>);

  const typeLabels = {
    card: 'Credit & Debit Cards',
    wallet: 'Digital Wallets',
    bank: 'Bank Transfers & Online Banking',
    bnpl: 'Buy Now, Pay Later',
    crypto: 'Cryptocurrency',
    cash: 'Cash & Offline Payments',
    local: 'Local Payment Methods'
  };

  const handleMethodClick = (method: PaymentMethod) => {
    onMethodSelect(method);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            All Payment Methods
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedMethods).map(([type, methods]) => (
            <div key={type}>
              <h3 className="text-lg font-semibold mb-3">{typeLabels[type as keyof typeof typeLabels]}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {methods.map((method) => {
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
                            <p className="text-xs text-muted-foreground mt-1">
                              Supported in: {method.supportedCountries.join(', ')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodsModal;