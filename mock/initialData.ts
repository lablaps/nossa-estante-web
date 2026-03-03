
import { User, Book, Transaction, Trade, Chat } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Sara Jenkins',
    email: 'sarah@example.com',
    reputation: 4.8,
    credits: 12,
    avatar: 'https://picsum.photos/seed/sarah/200'
  },
  {
    id: 'user_2',
    name: 'Maria Silva',
    email: 'maria@example.com',
    reputation: 4.9,
    credits: 250,
    avatar: 'https://picsum.photos/seed/maria/200'
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book_1',
    title: 'O Alquimista',
    author: 'Paulo Coelho',
    isbn: '978-0062315007',
    category: 'Ficção',
    language: 'Português',
    ownerId: 'user_2',
    status: 'Available',
    material_state: 'Muito Bom',
    creditsCost: 2,
    locationApprox: 'UEMA, São Luís',
    distance: '0.5km',
    photos: ['https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg'],
    synopsis: 'Uma fábula sobre seguir seus sonhos.'
  },
  {
    id: 'book_2',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    isbn: '978-0062316097',
    category: 'História',
    language: 'Português',
    ownerId: 'user_2',
    status: 'In Exchange',
    material_state: 'Bom',
    creditsCost: 3,
    locationApprox: 'UEMA, São Luís',
    distance: '1.2km',
    photos: ['https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg'],
    synopsis: 'Uma breve história da humanidade.'
  },
  {
    id: 'book_3',
    title: 'Hábitos Atômicos',
    author: 'James Clear',
    isbn: '978-0735211292',
    category: 'Autoajuda',
    language: 'Português',
    ownerId: 'user_2',
    status: 'Available',
    material_state: 'Novo',
    creditsCost: 2,
    locationApprox: 'UEMA, São Luís',
    distance: '2.0km',
    photos: ['https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg'],
    synopsis: 'Um método fácil e comprovado de criar bons hábitos.'
  },
  // Books for user_1 (Sara)
  {
    id: 'book_4',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    category: 'Ficção',
    language: 'Português',
    ownerId: 'user_1',
    status: 'Available',
    material_state: 'Bom',
    creditsCost: 1,
    locationApprox: 'UEMA, São Luís',
    distance: '0km',
    photos: ['https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg'],
    synopsis: 'Um romance distópico clássico.'
  },
  {
    id: 'book_5',
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    isbn: '978-0156012195',
    category: 'Infantil',
    language: 'Português',
    ownerId: 'user_1',
    status: 'In Exchange',
    material_state: 'Novo',
    creditsCost: 2,
    locationApprox: 'UEMA, São Luís',
    distance: '0km',
    photos: ['https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg'],
    synopsis: 'Um clássico da literatura infantil.'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    userId: 'user_1',
    type: 'earn',
    amount: 1,
    date: '24/10/2023',
    description: 'Enviou: O Hobbit'
  },
  {
    id: 'tx_2',
    userId: 'user_1',
    type: 'spend',
    amount: 1,
    date: '20/10/2023',
    description: 'Recebeu: Duna'
  }
];

export const INITIAL_TRADES: Trade[] = [
  {
    id: 'trade_1',
    bookId: 'book_5',
    fromUserId: 'user_1',
    toUserId: 'user_2',
    status: 'ongoing',
    meetingPoint: 'Livraria Lello, Porto',
    qrCodeFake: 'qrcode_123'
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    tradeId: 'trade_1',
    participants: ['user_1', 'user_2'],
    messages: [
      {
        id: 'msg_1',
        fromUserId: 'user_2',
        text: 'Olá Sara, tenho interesse no Pequeno Príncipe!',
        date: '10:00'
      },
      {
        id: 'msg_2',
        fromUserId: 'user_1',
        text: 'Oi Maria! Claro, está disponível.',
        date: '10:05'
      },
      {
        id: 'msg_3',
        fromUserId: 'user_2',
        text: 'Podemos nos encontrar na Livraria Lello?',
        date: '10:10'
      }
    ]
  }
];
