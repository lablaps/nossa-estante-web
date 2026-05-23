
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  credits?: number;
  reputation?: number;
  avatar?: string;
}

export type BookStatus = 'Available' | 'In Exchange' | 'Pending' | 'Exchanged';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn10?: string;
  isbn13?: string;
  gender: string;
  language: string;
  ownerId: string;
  ownerName?: string;
  status: string;
  material_state: string;
  cost: number;
  coverURL?: string;
  synopses: string;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  edition?: string;
  physicalFormat?: string;
  publishPlace?: string;
  contributors?: string[];
}

export interface Trade {
  id: string;
  bookId: string;
  bookTitle: string;
  fromUserId: string;
  fromUserName: string;
  fromUserPhone?: string;
  toUserId: string;
  toUserName: string;
  toUserPhone?: string;
  status: string;
  meetingPoint: string;
  statusA?: boolean;
  statusB?: boolean;
  statusTotal?: boolean;
  bookAId?: string;
  bookBId?: string;
  bookATitle?: string;
  bookBTitle?: string;
  book?: Book;
  from_user?: User;
  to_user?: User;
}

export interface TradeUpdateDTO {
  status_a: boolean;
  status_b: boolean;
  book_a_id: number;
  book_b_id: number;
}

export interface Message {
  id: string;
  fromUserId: string;
  text: string;
  date: string;
}

export interface ChatThread {
  tradeId: string;
  messages: Message[];
}

export interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: 'earn' | 'spend';
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

