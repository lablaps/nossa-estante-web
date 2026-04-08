import api from './api';
import { User, Book, Trade, BookRequestDTO } from '../types';


class DBService {
  // Users - No direct /users endpoints found in backend, but keep placeholders if needed or remove
  // For now, let's keep them commented out if they are not used, or remove them as per instruction
  
  private mapBook(b: any): Book {
    return {
      id: b.id?.toString() || '',
      title: b.title || '',
      author: b.author || '',
      isbn: b.isbn || b.isbn13 || b.isbn10 || '',
      isbn10: b.isbn10,
      isbn13: b.isbn13,
      gender: b.gender || '',
      user: typeof b.user === 'string' ? b.user : (b.user?.email || ''),
      status: b.status || '',
      material_state: b.material_state || '',
      cost: Number(b.cost) || 0,
      synopses: b.synopses || '',
      pages: (b.pageCount || b.pages || '0').toString(),
      coverURL: b.coverURL,
      publisher: b.publisher,
      publishedDate: b.publishedDate,
      language: b.language,
      edition: b.edition,
      physicalFormat: b.physicalFormat,
      publishPlace: b.publishPlace,
      contributors: b.contributors,
      data: b.data
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
      const response = await api.get('/books/user');
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
    // Map frontend Book to backend BookRequestDTO
    const dto: BookRequestDTO = {
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn,
      isbn10: book.isbn10,
      isbn13: book.isbn13,
      gender: book.gender || 'Ficção',
      status: book.status || 'Available',
      material_state: book.material_state || 'Good',
      cost: Number(book.cost) || 0,
      synopses: book.synopses || '',
      pageCount: Number(book.pages) || 0,
      coverURL: book.coverURL,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      language: book.language,
      edition: book.edition,
      physicalFormat: book.physicalFormat,
      publishPlace: book.publishPlace,
      contributors: book.contributors
    };
    const response = await api.post('/books', dto);
    return this.mapBook(response.data);
  }

  async getBookById(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return this.mapBook(response.data);
  }

  // Exchanges (formerly Trades)
  async getTrades(): Promise<Trade[]> {
    const response = await api.get('/exchanges');
    // Map response if hateoas
    const data = response.data;
    let rawExchanges: any[] = [];
    if (data._embedded && Array.isArray(data._embedded.exchangeResponseList)) {
      rawExchanges = data._embedded.exchangeResponseList;
    } else {
      rawExchanges = Array.isArray(data) ? data : (data.content || []);
    }
    
    // Ensure it matches Trade interface (Strings)
    return rawExchanges.map(ex => ({
      id: ex.id?.toString() || '',
      book: ex.book || '',
      from_user: ex.from_user || '',
      to_user: ex.to_user || ''
    }));
  }

  async createTrade(bookId: string, ownerId?: string): Promise<Trade> {
    const response = await api.post('/exchanges', { 
      book_id: Number(bookId),
      to_user: ownerId ? Number(ownerId) : undefined
    });
    return response.data;
  }
}

export const dbService = new DBService();
