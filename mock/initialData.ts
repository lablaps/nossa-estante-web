
import { User, Book, Trade } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Sara Jenkins',
    email: 'sarah@example.com',
    role: 'USER'
  },
  {
    id: 'user_2',
    name: 'Maria Silva',
    email: 'maria@example.com',
    role: 'USER'
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book_1',
    title: 'O Alquimista',
    author: 'Paulo Coelho',
    isbn10: '0062315005',
    isbn13: '9780062315007',
    gender: 'Ficção',
    language: 'Português',
    ownerId: 'user_2',
    status: 'Available',
    material_state: 'Muito Bom',
    cost: 2,
    coverURL: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
    synopses: 'Uma fábula sobre seguir seus sonhos.'
  },
  {
    id: 'book_2',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    isbn10: '0062316095',
    isbn13: '9780062316097',
    gender: 'História',
    language: 'Português',
    ownerId: 'user_2',
    status: 'In Exchange',
    material_state: 'Bom',
    cost: 3,
    coverURL: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
    synopses: 'Uma breve história da humanidade.'
  },
  {
    id: 'book_3',
    title: 'Hábitos Atômicos',
    author: 'James Clear',
    isbn10: '0735211299',
    isbn13: '9780735211292',
    gender: 'Autoajuda',
    language: 'Português',
    ownerId: 'user_2',
    status: 'Available',
    material_state: 'Novo',
    cost: 2,
    coverURL: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    synopses: 'Um método fácil e comprovado de criar bons hábitos.'
  },
  {
    id: 'book_4',
    title: '1984',
    author: 'George Orwell',
    isbn10: '0451524934',
    isbn13: '9780451524935',
    gender: 'Ficção',
    language: 'Português',
    ownerId: 'user_1',
    status: 'Available',
    material_state: 'Bom',
    cost: 1,
    coverURL: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
    synopses: 'Um romance distópico clássico.'
  },
  {
    id: 'book_5',
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    isbn10: '0156012197',
    isbn13: '9780156012195',
    gender: 'Infantil',
    language: 'Português',
    ownerId: 'user_1',
    status: 'In Exchange',
    material_state: 'Novo',
    cost: 2,
    coverURL: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',
    synopses: 'Um clássico da literatura infantil.'
  }
];

export const INITIAL_TRADES: Trade[] = [
  {
    id: 'trade_1',
    book: INITIAL_BOOKS[4],
    from_user: INITIAL_USERS[0],
    to_user: INITIAL_USERS[1]
  }
];
