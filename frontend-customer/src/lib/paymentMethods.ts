import {
  CreditCard,
  Smartphone,
  Wallet,
  Building2,
  Clock,
  Bitcoin,
  QrCode,
  Globe,
  LucideIcon
} from "lucide-react";

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'wallet' | 'bank' | 'bnpl' | 'crypto' | 'cash' | 'local';
  icon: LucideIcon;
  description: string;
  supportedCountries: string[]; // Country names or codes
  apiPlaceholder: string; // Placeholder for API integration
}

export const paymentMethods: PaymentMethod[] = [
  // Credit / Debit Cards
  {
    id: 'visa',
    name: 'Visa',
    type: 'card',
    icon: CreditCard,
    description: 'Pay with Visa credit or debit card',
    supportedCountries: ['Global'],
    apiPlaceholder: '// VISA_API_INTEGRATION_HERE - Implement Visa payment gateway'
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    type: 'card',
    icon: CreditCard,
    description: 'Pay with Mastercard credit or debit card',
    supportedCountries: ['Global'],
    apiPlaceholder: '// MASTERCARD_API_INTEGRATION_HERE - Implement Mastercard payment gateway'
  },
  {
    id: 'amex',
    name: 'American Express',
    type: 'card',
    icon: CreditCard,
    description: 'Pay with American Express card',
    supportedCountries: ['Global'],
    apiPlaceholder: '// AMEX_API_INTEGRATION_HERE - Implement AmEx payment gateway'
  },
  {
    id: 'discover',
    name: 'Discover',
    type: 'card',
    icon: CreditCard,
    description: 'Pay with Discover card',
    supportedCountries: ['United States'],
    apiPlaceholder: '// DISCOVER_API_INTEGRATION_HERE - Implement Discover payment gateway'
  },
  {
    id: 'unionpay',
    name: 'UnionPay',
    type: 'card',
    icon: CreditCard,
    description: 'Pay with UnionPay card',
    supportedCountries: ['China', 'Japan', 'South Korea', 'Singapore'],
    apiPlaceholder: '// UNIONPAY_API_INTEGRATION_HERE - Implement UnionPay payment gateway'
  },

  // Digital Wallets
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay securely with PayPal',
    supportedCountries: ['Global'],
    apiPlaceholder: '// PAYPAL_API_INTEGRATION_HERE - Implement PayPal SDK'
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with Apple Pay on iOS devices',
    supportedCountries: ['Global'],
    apiPlaceholder: '// APPLE_PAY_API_INTEGRATION_HERE - Implement Apple Pay'
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with Google Pay',
    supportedCountries: ['Global'],
    apiPlaceholder: '// GOOGLE_PAY_API_INTEGRATION_HERE - Implement Google Pay'
  },
  {
    id: 'samsung_pay',
    name: 'Samsung Pay',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with Samsung Pay',
    supportedCountries: ['Global'],
    apiPlaceholder: '// SAMSUNG_PAY_API_INTEGRATION_HERE - Implement Samsung Pay'
  },
  {
    id: 'alipay',
    name: 'Alipay',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with Alipay digital wallet',
    supportedCountries: ['China', 'Japan', 'South Korea', 'Singapore'],
    apiPlaceholder: '// ALIPAY_API_INTEGRATION_HERE - Implement Alipay API'
  },
  {
    id: 'wechat_pay',
    name: 'WeChat Pay',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with WeChat Pay',
    supportedCountries: ['China', 'Japan', 'South Korea', 'Singapore'],
    apiPlaceholder: '// WECHAT_PAY_API_INTEGRATION_HERE - Implement WeChat Pay API'
  },
  {
    id: 'venmo',
    name: 'Venmo',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with Venmo',
    supportedCountries: ['United States'],
    apiPlaceholder: '// VENMO_API_INTEGRATION_HERE - Implement Venmo API'
  },
  {
    id: 'cash_app',
    name: 'Cash App',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with Cash App',
    supportedCountries: ['United States'],
    apiPlaceholder: '// CASH_APP_API_INTEGRATION_HERE - Implement Cash App API'
  },
  {
    id: 'grabpay',
    name: 'GrabPay',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with GrabPay',
    supportedCountries: ['Singapore', 'Malaysia', 'Thailand', 'Vietnam'],
    apiPlaceholder: '// GRABPAY_API_INTEGRATION_HERE - Implement GrabPay API'
  },
  {
    id: 'gcash',
    name: 'GCash',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with GCash',
    supportedCountries: ['Philippines'],
    apiPlaceholder: '// GCASH_API_INTEGRATION_HERE - Implement GCash API'
  },
  {
    id: 'paytm',
    name: 'Paytm',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with Paytm',
    supportedCountries: ['India'],
    apiPlaceholder: '// PAYTM_API_INTEGRATION_HERE - Implement Paytm API'
  },
  {
    id: 'truemoney',
    name: 'TrueMoney',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with TrueMoney',
    supportedCountries: ['Thailand'],
    apiPlaceholder: '// TRUEMONEY_API_INTEGRATION_HERE - Implement TrueMoney API'
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with ShopeePay',
    supportedCountries: ['Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Philippines'],
    apiPlaceholder: '// SHOPEEPAY_API_INTEGRATION_HERE - Implement ShopeePay API'
  },

  // Local/Mobile Money Wallets
  {
    id: 'mpesa',
    name: 'M-Pesa',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with M-Pesa mobile money',
    supportedCountries: ['Kenya', 'Tanzania', 'Uganda'],
    apiPlaceholder: '// MPESA_API_INTEGRATION_HERE - Implement M-Pesa API'
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with Orange Money',
    supportedCountries: ['Ivory Coast', 'Senegal', 'Mali', 'Cameroon'],
    apiPlaceholder: '// ORANGE_MONEY_API_INTEGRATION_HERE - Implement Orange Money API'
  },
  {
    id: 'mtn_mobile_money',
    name: 'MTN Mobile Money',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with MTN Mobile Money',
    supportedCountries: ['Ghana', 'Rwanda', 'Uganda', 'Zambia'],
    apiPlaceholder: '// MTN_MOBILE_MONEY_API_INTEGRATION_HERE - Implement MTN API'
  },
  {
    id: 'airtel_money',
    name: 'Airtel Money',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with Airtel Money',
    supportedCountries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Malawi', 'Zambia', 'Madagascar'],
    apiPlaceholder: '// AIRTEL_MONEY_API_INTEGRATION_HERE - Implement Airtel Money API'
  },
  {
    id: 'opay',
    name: 'Opay',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with Opay digital wallet',
    supportedCountries: ['Nigeria'],
    apiPlaceholder: '// OPAY_API_INTEGRATION_HERE - Implement Opay API'
  },
  {
    id: 'palmpay',
    name: 'PalmPay',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with PalmPay',
    supportedCountries: ['Nigeria'],
    apiPlaceholder: '// PALMPAY_API_INTEGRATION_HERE - Implement PalmPay API'
  },
  {
    id: 'monify',
    name: 'Monify (Moniepoint)',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with Monify',
    supportedCountries: ['Nigeria'],
    apiPlaceholder: '// MONIFY_API_INTEGRATION_HERE - Implement Monify API'
  },
  {
    id: 'paga',
    name: 'Paga',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with Paga',
    supportedCountries: ['Nigeria'],
    apiPlaceholder: '// PAGA_API_INTEGRATION_HERE - Implement Paga API'
  },
  {
    id: 'chipper_cash',
    name: 'Chipper Cash',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with Chipper Cash',
    supportedCountries: ['Nigeria', 'Kenya', 'Ghana', 'South Africa'],
    apiPlaceholder: '// CHIPPER_CASH_API_INTEGRATION_HERE - Implement Chipper Cash API'
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with Flutterwave',
    supportedCountries: ['Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Rwanda', 'Tanzania'],
    apiPlaceholder: '// FLUTTERWAVE_API_INTEGRATION_HERE - Implement Flutterwave API'
  },
  {
    id: 'paystack',
    name: 'Paystack',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with Paystack',
    supportedCountries: ['Nigeria', 'Ghana', 'South Africa', 'Kenya'],
    apiPlaceholder: '// PAYSTACK_API_INTEGRATION_HERE - Implement Paystack API'
  },
  {
    id: 'eversend',
    name: 'Eversend',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with Eversend',
    supportedCountries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Ghana', 'Nigeria'],
    apiPlaceholder: '// EVERSEND_API_INTEGRATION_HERE - Implement Eversend API'
  },
  {
    id: 'wave_money',
    name: 'Wave Money',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with Wave Money',
    supportedCountries: ['Senegal'],
    apiPlaceholder: '// WAVE_MONEY_API_INTEGRATION_HERE - Implement Wave Money API'
  },
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with EasyPaisa',
    supportedCountries: ['Pakistan'],
    apiPlaceholder: '// EASYPAISA_API_INTEGRATION_HERE - Implement EasyPaisa API'
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    type: 'wallet',
    icon: Smartphone,
    description: 'Pay with JazzCash',
    supportedCountries: ['Pakistan'],
    apiPlaceholder: '// JAZZCASH_API_INTEGRATION_HERE - Implement JazzCash API'
  },

  // Bank Transfers / Online Banking
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'bank',
    icon: Building2,
    description: 'Pay with Stripe',
    supportedCountries: ['Global'],
    apiPlaceholder: '// STRIPE_API_INTEGRATION_HERE - Implement Stripe API'
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    type: 'bank',
    icon: Building2,
    description: 'Direct bank transfer payment',
    supportedCountries: ['Global'],
    apiPlaceholder: '// BANK_TRANSFER_API_INTEGRATION_HERE - Implement bank transfer API'
  },
  {
    id: 'zelle',
    name: 'Zelle',
    type: 'bank',
    icon: Building2,
    description: 'Pay with Zelle',
    supportedCountries: ['United States'],
    apiPlaceholder: '// ZELLE_API_INTEGRATION_HERE - Implement Zelle API'
  },
  {
    id: 'ideal',
    name: 'iDEAL',
    type: 'bank',
    icon: Building2,
    description: 'Dutch online banking payment',
    supportedCountries: ['Netherlands'],
    apiPlaceholder: '// IDEAL_API_INTEGRATION_HERE - Implement iDEAL'
  },
  {
    id: 'bancontact',
    name: 'Bancontact',
    type: 'bank',
    icon: Building2,
    description: 'Belgian online banking payment',
    supportedCountries: ['Belgium'],
    apiPlaceholder: '// BANCONTACT_API_INTEGRATION_HERE - Implement Bancontact'
  },
  {
    id: 'sofort',
    name: 'Sofort',
    type: 'bank',
    icon: Building2,
    description: 'German online banking payment',
    supportedCountries: ['Germany', 'Austria'],
    apiPlaceholder: '// SOFORT_API_INTEGRATION_HERE - Implement Sofort'
  },
  {
    id: 'sepa',
    name: 'SEPA Direct Debit',
    type: 'bank',
    icon: Building2,
    description: 'European direct debit payment',
    supportedCountries: ['European Union'],
    apiPlaceholder: '// SEPA_API_INTEGRATION_HERE - Implement SEPA'
  },
  {
    id: 'giropay',
    name: 'Giropay',
    type: 'bank',
    icon: Building2,
    description: 'German online banking payment',
    supportedCountries: ['Germany'],
    apiPlaceholder: '// GIROPAY_API_INTEGRATION_HERE - Implement Giropay'
  },
  {
    id: 'trustly',
    name: 'Trustly',
    type: 'bank',
    icon: Building2,
    description: 'Nordic online banking payment',
    supportedCountries: ['Sweden', 'Finland', 'Norway', 'Denmark'],
    apiPlaceholder: '// TRUSTLY_API_INTEGRATION_HERE - Implement Trustly'
  },
  {
    id: 'revolut',
    name: 'Revolut',
    type: 'bank',
    icon: Building2,
    description: 'Pay with Revolut',
    supportedCountries: ['United Kingdom', 'European Union'],
    apiPlaceholder: '// REVOLUT_API_INTEGRATION_HERE - Implement Revolut API'
  },
  {
    id: 'stc_pay',
    name: 'STC Pay',
    type: 'bank',
    icon: Smartphone,
    description: 'Pay with STC Pay',
    supportedCountries: ['Saudi Arabia'],
    apiPlaceholder: '// STC_PAY_API_INTEGRATION_HERE - Implement STC Pay API'
  },
  {
    id: 'mada',
    name: 'Mada',
    type: 'bank',
    icon: CreditCard,
    description: 'Pay with Mada card',
    supportedCountries: ['Saudi Arabia'],
    apiPlaceholder: '// MADA_API_INTEGRATION_HERE - Implement Mada API'
  },
  {
    id: 'fawry',
    name: 'Fawry',
    type: 'bank',
    icon: Building2,
    description: 'Pay with Fawry',
    supportedCountries: ['Egypt'],
    apiPlaceholder: '// FAWRY_API_INTEGRATION_HERE - Implement Fawry API'
  },
  {
    id: 'paytabs',
    name: 'PayTabs',
    type: 'bank',
    icon: Building2,
    description: 'Pay with PayTabs',
    supportedCountries: ['United Arab Emirates', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman'],
    apiPlaceholder: '// PAYTABS_API_INTEGRATION_HERE - Implement PayTabs API'
  },
  {
    id: 'telr',
    name: 'Telr',
    type: 'bank',
    icon: Building2,
    description: 'Pay with Telr',
    supportedCountries: ['Middle East', 'North Africa'],
    apiPlaceholder: '// TELR_API_INTEGRATION_HERE - Implement Telr API'
  },

  // Buy Now, Pay Later
  {
    id: 'klarna',
    name: 'Klarna',
    type: 'bnpl',
    icon: Clock,
    description: 'Buy now, pay later with Klarna',
    supportedCountries: ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Sweden', 'Norway', 'Denmark', 'Finland'],
    apiPlaceholder: '// KLARNA_API_INTEGRATION_HERE - Implement Klarna BNPL'
  },
  {
    id: 'afterpay',
    name: 'Afterpay',
    type: 'bnpl',
    icon: Clock,
    description: 'Buy now, pay later with Afterpay',
    supportedCountries: ['United States', 'Canada', 'Australia', 'New Zealand'],
    apiPlaceholder: '// AFTERPAY_API_INTEGRATION_HERE - Implement Afterpay'
  },
  {
    id: 'affirm',
    name: 'Affirm',
    type: 'bnpl',
    icon: Clock,
    description: 'Buy now, pay later with Affirm',
    supportedCountries: ['United States', 'Canada'],
    apiPlaceholder: '// AFFIRM_API_INTEGRATION_HERE - Implement Affirm BNPL'
  },

  // Cryptocurrency
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    type: 'crypto',
    icon: Bitcoin,
    description: 'Pay with Bitcoin cryptocurrency',
    supportedCountries: ['Global'],
    apiPlaceholder: '// BITCOIN_API_INTEGRATION_HERE - Implement Bitcoin payment processor'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    type: 'crypto',
    icon: Bitcoin,
    description: 'Pay with Ethereum cryptocurrency',
    supportedCountries: ['Global'],
    apiPlaceholder: '// ETHEREUM_API_INTEGRATION_HERE - Implement Ethereum payment processor'
  },
  {
    id: 'usdc',
    name: 'USDC (Stablecoin)',
    type: 'crypto',
    icon: Bitcoin,
    description: 'Pay with USDC stablecoin',
    supportedCountries: ['Global'],
    apiPlaceholder: '// USDC_API_INTEGRATION_HERE - Implement USDC payment processor'
  },

  // Cash / Offline / Voucher / QR
  {
    id: 'cash_on_delivery',
    name: 'Cash on Delivery',
    type: 'cash',
    icon: QrCode,
    description: 'Pay cash when goods are delivered',
    supportedCountries: ['Global'],
    apiPlaceholder: '// CASH_ON_DELIVERY_API_INTEGRATION_HERE - Implement COD tracking'
  },
  {
    id: 'qr_payment',
    name: 'QR Code Payment',
    type: 'cash',
    icon: QrCode,
    description: 'Scan QR code to pay',
    supportedCountries: ['China', 'Japan', 'South Korea', 'Thailand', 'Vietnam', 'Philippines'],
    apiPlaceholder: '// QR_PAYMENT_API_INTEGRATION_HERE - Implement QR payment gateway'
  },
  {
    id: 'voucher',
    name: 'Gift Voucher',
    type: 'cash',
    icon: QrCode,
    description: 'Pay with gift voucher or coupon',
    supportedCountries: ['Global'],
    apiPlaceholder: '// VOUCHER_API_INTEGRATION_HERE - Implement voucher redemption'
  },
  {
    id: 'pix',
    name: 'PIX',
    type: 'cash',
    icon: QrCode,
    description: 'Pay with PIX instant payment',
    supportedCountries: ['Brazil'],
    apiPlaceholder: '// PIX_API_INTEGRATION_HERE - Implement PIX API'
  },
  {
    id: 'mercadopago',
    name: 'MercadoPago',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with MercadoPago',
    supportedCountries: ['Brazil', 'Argentina', 'Mexico', 'Chile', 'Colombia', 'Peru', 'Uruguay'],
    apiPlaceholder: '// MERCADOPAGO_API_INTEGRATION_HERE - Implement MercadoPago API'
  },
  {
    id: 'boleto',
    name: 'Boleto Bancário',
    type: 'cash',
    icon: QrCode,
    description: 'Pay with Boleto Bancário',
    supportedCountries: ['Brazil'],
    apiPlaceholder: '// BOLETO_API_INTEGRATION_HERE - Implement Boleto API'
  },
  {
    id: 'pagseguro',
    name: 'PagSeguro',
    type: 'wallet',
    icon: Wallet,
    description: 'Pay with PagSeguro',
    supportedCountries: ['Brazil'],
    apiPlaceholder: '// PAGSEGURO_API_INTEGRATION_HERE - Implement PagSeguro API'
  }
];

export const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan',
  'China', 'South Korea', 'Singapore', 'Netherlands', 'Belgium', 'New Zealand',
  'Nigeria', 'Kenya', 'South Africa', 'Tanzania', 'Ivory Coast', 'Senegal', 'Mali',
  'Cameroon', 'Ghana', 'Rwanda', 'Uganda', 'Zambia', 'Thailand', 'Vietnam'
];