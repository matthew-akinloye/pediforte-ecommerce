// user.ts
export interface User {
  uid: string;
  email: string;
  role: string;
  firstName?: string; // Optional field, add if applicable
  lastName?: string;  // Optional field, add if applicable
  createdAt?: string;
}
