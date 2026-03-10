import api from './api';
import { User, Book, Transaction, Trade, Chat } from '../types';

class DBService {
  // Users
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  }

  async saveUsers(users: User[]): Promise<void> {
    await api.put('/users', users);
  }

  // Books
  private mapBook(b: any): Book {
    return {
      id: b.id?.toString() || '',
      title: b.title || 'Untitled',
      author: b.author || 'Unknown Author',
      isbn: b.isbn || '',
      category: b.gender || 'General',
      language: b.language || 'Portuguese',
      ownerId: b.userId?.toString() || b.user || '',
      status: b.status || 'Available',
      material_state: b.material_state || 'Good',
      creditsCost: Number(b.cost) || 0,
      locationApprox: b.location || 'São Luís, MA',
      distance: '1.2km', // Mock for now
      photos: (b.photos && b.photos.length > 0) ? b.photos : [`https://picsum.photos/seed/${b.id || Math.random()}/400/600`],
      synopsis: b.synopses || b.synopsis || '',
      ownerNotes: b.notes || ''
    };
  }

  async getBooks(): Promise<Book[]> {
    try {
      const response = await api.get('/books');
      const data = response.data;

      // Handle Spring HATEOAS CollectionModel or Page
      let rawBooks: any[] = [];
      if (data._embedded && Array.isArray(data._embedded.bookResponseList)) {
        rawBooks = data._embedded.bookResponseList;
      } else if (Array.isArray(data.content)) {
        rawBooks = data.content;
      } else if (Array.isArray(data)) {
        rawBooks = data;
      }

      return rawBooks.map(b => this.mapBook(b));
    } catch (error) {
      console.error('Error in getBooks:', error);
      return [];
    }
  }

  async getMyBooks(): Promise<Book[]> {
    try {
      const response = await api.get('/books/me');
      const data = response.data;

      let rawBooks: any[] = [];
      if (data._embedded && Array.isArray(data._embedded.bookResponseList)) {
        rawBooks = data._embedded.bookResponseList;
      } else if (Array.isArray(data.content)) {
        rawBooks = data.content;
      } else if (Array.isArray(data)) {
        rawBooks = data;
      }

      return rawBooks.map(b => this.mapBook(b));
    } catch (error) {
      console.error('Error in getMyBooks:', error);
      return [];
    }
  }

  async addBook(book: Partial<Book>): Promise<Book> {
    // Map frontend Book to backend BookRequestDTO if necessary
    const dto = {
      isbn: book.isbn,
      material_state: book.material_state,
      status: book.status,
      cost: book.creditsCost,
      title: book.title,
      author: book.author,
      gender: book.category,
      pages: '0', // Adjust if possible
      synopses: book.synopsis
    };
    const response = await api.post('/books', dto);
    return this.mapBook(response.data);
  }

  async getBookById(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return this.mapBook(response.data);
  }

  // Trades
  async getTrades(): Promise<Trade[]> {
    const response = await api.get('/trades');
    return response.data;
  }

  async createTrade(trade: Trade): Promise<Trade> {
    const response = await api.post('/trades', trade);
    return response.data;
  }

  // Chats
  async getChats(): Promise<Chat[]> {
    const response = await api.get('/chats');
    return response.data;
  }

  async addMessage(tradeId: string, message: any): Promise<void> {
    await api.post(`/chats/${tradeId}/messages`, message);
  }

  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    const response = await api.get(`/transactions/user/${userId}`);
    return response.data;
  }
}

export const dbService = new DBService();
