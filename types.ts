
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
  isbn10?: string;
  isbn13?: string;
  gender: string;
  language: string;
  ownerId: string;
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
  book: Book;
  from_user: User;
  to_user: User;
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

