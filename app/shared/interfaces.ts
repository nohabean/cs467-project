export interface ProductListing {
  id: number;
  activeStatus: "active" | "inactive";
  title: string;
  description: string;
  seller: string;
  price: number;
  createdDatetime: string;
  updatedDatetime: string;
  expirationDatetime: string | null;

  // new attributes
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
  location: string;
  isSold: boolean;

  // temporary attribute
  image?: string;
}

export interface User {
  username: string;
  email: string | null;
  passwordHash: string;
  createdDatetime: string;
  updatedDatetime: string;

  // new attributes
  image: string;
  name?: string;
  rating?: number;
  location?: string;
}

export interface Message {
  id: number;
  sender: string;
  recipient: string;
  message_body: string;
  sent_datetime: string;
}
