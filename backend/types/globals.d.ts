interface User {
  email: string;
  name: string;
}

interface Booking {
  code: string;
  startDate: string;
  endDate: string;
}

interface Camp {
  name: string;
  phoneNumber: string;
  email: string;
  ownerId: {
    name: string;
  };
  location: string;
}

interface Token {
  tokenValue: string;
}

interface TransferAmount {
  tax: number;
  commissionAmount: number;
}

interface Invoice {
  invoiceNumber: number;
}
