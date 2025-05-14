
// Define feedback interface
export interface CustomerFeedback {
  id: string;
  bookingId: string;
  customerName: string;
  name: string;
  email?: string;
  date: string;
  rating: number;
  comment: string;
  responded: boolean;
  images?: string[];
}
