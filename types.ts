
export interface User {
  id: string;
  name: string;
  email: string;
  reputation: number;
  credits: number;
  avatar?: string;
  role?: string;
  cpf?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  isFirstAccess?: boolean;
}

export type BookStatus = 'Available' | 'In Exchange' | 'Pending' | 'Exchanged';
export type BookCondition = 'New' | 'Very Good' | 'Good' | 'Used' | 'Fair';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn10?: string;
  isbn13?: string;
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
  coverURL?: string;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  edition?: string;
  physicalFormat?: string;
  publishPlace?: string;
  contributors?: string[];
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
  title: string;
  author: string;
  coverURL?: string;
  synopses?: string;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  isbn10?: string;
  isbn13?: string;
  language?: string;
  edition?: string;
  material_state: string;
  physicalFormat?: string;
  publishPlace?: string;
  status: string;
  cost: number;
  gender: string;
  contributors?: string[];
}
