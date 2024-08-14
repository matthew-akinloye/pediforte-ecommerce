

export interface Order {
  id?: string; // or define as per your Firestore structure
  userId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  status: string;
  createdAt?: string;
}
