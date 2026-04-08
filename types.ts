
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export type BookStatus = 'Available' | 'In Exchange' | 'Pending' | 'Exchanged';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  isbn10?: string;
  isbn13?: string;
  gender: string;
  user: string;
  status: string;
  material_state: string;
  cost: number;
  synopses: string;
  pages: string;
  coverURL?: string;
  publisher?: string;
  publishedDate?: string;
  language?: string;
  edition?: string;
  physicalFormat?: string;
  publishPlace?: string;
  contributors?: string[];
  data?: string;
}

export interface Trade {
  id: string;
  book: string; // Backend returns title/string
  from_user: string; // Backend returns email/name
  to_user: string; // Backend returns email/name
}

export interface BookRequestDTO {
  title: string;
  author: string;
  isbn?: string;
  isbn10?: string;
  isbn13?: string;
  gender: string;
  status: string;
  material_state: string;
  cost: number;
  synopses: string;
  pageCount: number;
  coverURL?: string;
  publisher?: string;
  publishedDate?: string;
  language?: string;
  edition?: string;
  physicalFormat?: string;
  publishPlace?: string;
  contributors?: string[];
}

