
export interface User {
  id: string;
  name: string;
  email: string;
  reputation: number;
  credits: number;
  avatar?: string;
  role?: string;
}

export type BookStatus = 'Available' | 'In Exchange' | 'Pending' | 'Exchanged';
export type BookCondition = 'New' | 'Very Good' | 'Good' | 'Used' | 'Fair';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  language: string;
  ownerId: string;
  status: BookStatus;
  material_state: string;
  creditsCost: number;
  locationApprox: string;
  distance?: string;
  photos: string[];
  synopsis: string;
  ownerNotes?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend';
  amount: number;
  date: string;
  description: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  text: string;
  date: string;
}

export interface Chat {
  tradeId: string;
  participants: string[];
  messages: Message[];
}

export type TradeStatus = 'ongoing' | 'completed' | 'cancelled';

export interface Trade {
  id: string;
  bookId: string;
  fromUserId: string; // Owner
  toUserId: string;   // Requester
  status: TradeStatus;
  meetingPoint: string;
  qrCodeFake: string;
}

export interface BookRequestDTO {
  isbn: string;
  material_state: string;
  status: string;
  cost: number;
  title: string;
  author: string;
  gender: string;
  pages: string;
  synopses: string;
}
