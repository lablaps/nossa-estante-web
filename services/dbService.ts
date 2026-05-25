import api from './api';
import { Book, Trade, BookRequestDTO, ChatThread, Message, Transaction, TradeUpdateDTO } from '../types';


class DBService {
  // Users - No direct /users endpoints found in backend, but keep placeholders if needed or remove
  // For now, let's keep them commented out if they are not used, or remove them as per instruction

  private parseUserString(value?: string) {
    if (!value) return {};

    const id = value.match(/id=([^,\)]+)/)?.[1]?.trim();
    const name = value.match(/name=([^,\)]+)/)?.[1]?.trim();
    const email = value.match(/email=([^,\)]+)/)?.[1]?.trim().toLowerCase();

    return { id, name, email };
  }

  private formatOwnerName(value?: string) {
    if (!value) return '';
    return value.includes('@') ? value.toLowerCase() : value;
  }
  
  private mapBook(b: any): Book {
    b = this.unwrapEntity(b);
    const userText = typeof b.user === 'string' ? this.parseUserString(b.user) : {};
    const ownerText = typeof b.ownerName === 'string' ? this.parseUserString(b.ownerName) : {};
    const ownerName = this.formatOwnerName(b.user?.name || ownerText.name || ownerText.email || userText.name || userText.email || b.ownerName || '');

    return {
      id: b.id?.toString() || '',
      title: b.title || '',
      author: b.author || '',
      isbn10: b.isbn10,
      isbn13: b.isbn13,
      gender: b.gender || '',
      language: b.language || '',
      ownerId: b.user?.id?.toString() || b.userId?.toString() || b.ownerId?.toString() || ownerText.id || userText.id || '',
      ownerName,
      status: b.status || '',
      material_state: b.material_state || '',
      cost: Number(b.cost) || 0,
      synopses: b.synopses || '',
      coverURL: b.coverURL,
      pageCount: b.pageCount,
      publisher: b.publisher,
      publishedDate: b.publishedDate,
      edition: b.edition,
      physicalFormat: b.physicalFormat,
      publishPlace: b.publishPlace,
      contributors: b.contributors || []
    };
  }

  async getBooks(): Promise<Book[]> {
    try {
      let response;
      try {
        response = await api.get('/catalogo/books');
      } catch (catalogError) {
        response = await api.get('/books');
      }
      const data = response.data;

      let rawBooks = this.getEmbeddedList(data, ['bookResponseList']);

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
      coverURL: book.coverURL,
      synopses: book.synopses,
      pageCount: book.pageCount,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      isbn10: book.isbn10,
      isbn13: book.isbn13,
      language: book.language,
      edition: book.edition,
      material_state: book.material_state || 'Good',
      physicalFormat: book.physicalFormat,
      publishPlace: book.publishPlace,
      status: book.status || 'Available',
      cost: book.cost || 0,
      gender: book.gender || 'Ficção',
      contributors: book.contributors
    };
    const response = await api.post('/books', dto);
    return this.mapBook(response.data);
  }

  async getBookById(id: string): Promise<Book> {
    let response;
    try {
      response = await api.get(`/catalogo/books/${id}`);
    } catch (catalogError) {
      response = await api.get(`/books/${id}`);
    }
    return this.mapBook(response.data);
  }

  private unwrapEntity(data: any) {
    return data?.content || data;
  }

  private getEmbeddedList(data: any, keys: string[]) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (!data?._embedded) return [];

    for (const key of keys) {
      if (Array.isArray(data._embedded[key])) {
        return data._embedded[key].map((item: any) => this.unwrapEntity(item));
      }
    }

    const first = Object.values(data._embedded).find(Array.isArray) as any[] | undefined;
    return first ? first.map((item: any) => this.unwrapEntity(item)) : [];
  }

  private mergeLocalTradeState(trade: Trade): Trade {
    const raw = localStorage.getItem('ns_trade_state');
    const states = raw ? JSON.parse(raw) : {};
    return states[trade.id] ? { ...trade, ...states[trade.id] } : trade;
  }

  private saveLocalTradeState(id: string, partial: Partial<Trade>) {
    const raw = localStorage.getItem('ns_trade_state');
    const states = raw ? JSON.parse(raw) : {};
    states[id] = { ...(states[id] || {}), ...partial };
    localStorage.setItem('ns_trade_state', JSON.stringify(states));
  }

  private mapTrade(raw: any): Trade {
    const t = this.unwrapEntity(raw);
    const fromUserText = typeof t.from_user === 'string' ? this.parseUserString(t.from_user) : {};
    const toUserText = typeof t.to_user === 'string' ? this.parseUserString(t.to_user) : {};
    const bookBId = t.bookBId?.toString() || t.book_b_id?.toString() || t.bookId?.toString() || t.book_id?.toString() || '';
    const bookAId = t.bookAId?.toString() || t.book_a_id?.toString() || '';
    const fromUserName = this.formatOwnerName(t.fromUserName || fromUserText.name || fromUserText.email || t.from_user || '');
    const toUserName = this.formatOwnerName(t.toUserName || toUserText.name || toUserText.email || t.to_user || '');

    return {
      id: t.id?.toString() || '',
      bookId: bookBId,
      bookTitle: t.bookTitle || t.book_b_title || t.book_b || '',
      fromUserId: t.fromUserId?.toString() || t.from_user_id?.toString() || fromUserText.id || '',
      fromUserName,
      fromUserPhone: t.fromUserPhone || t.from_user_phone || t.fromPhone || '',
      toUserId: t.toUserId?.toString() || t.to_user_id?.toString() || toUserText.id || '',
      toUserName,
      toUserPhone: t.toUserPhone || t.to_user_phone || t.toPhone || '',
      status: t.status || (t.status_total ? 'ACCEPTED' : 'OPEN'),
      meetingPoint: t.meetingPoint || 'A combinar'
      ,
      statusA: Boolean(t.statusA ?? t.status_a),
      statusB: Boolean(t.statusB ?? t.status_b),
      statusTotal: Boolean(t.statusTotal ?? t.status_total),
      bookAId,
      bookBId,
      bookATitle: t.bookATitle || t.book_a_title || t.book_a || '',
      bookBTitle: t.bookBTitle || t.book_b_title || t.book_b || t.bookTitle || ''
    };
  }

  // Exchanges (formerly Trades)
  async getTrades(): Promise<Trade[]> {
    const response = await api.get('/exchanges');
    // Map response if hateoas
    const data = response.data;
    const rawExchanges = this.getEmbeddedList(data, ['exchangeResponseList']);
    return rawExchanges.map(t => this.mergeLocalTradeState(this.mapTrade(t)));
  }

  async getTradeById(id: string): Promise<Trade> {
    const response = await api.get(`/exchanges/${id}`);
    return this.mergeLocalTradeState(this.mapTrade(response.data));
  }

  async createTrade(bookId: string, ownerId?: string, meetingPoint?: string): Promise<Trade> {
    const response = await api.post('/exchanges', { 
      bookId: Number(bookId),
      book_id: Number(bookId),
      book_b_id: Number(bookId),
      toUserId: ownerId ? Number(ownerId) : undefined,
      to_user: ownerId ? Number(ownerId) : undefined,
      meetingPoint
    });
    return this.mapTrade(response.data);
  }

  async updateTrade(id: string, dto: TradeUpdateDTO): Promise<Trade> {
    try {
      const response = await api.put(`/exchanges/${id}`, dto);
      return this.mapTrade(response.data);
    } catch (error) {
      this.saveLocalTradeState(id, {
        statusA: dto.status_a,
        statusB: dto.status_b,
        statusTotal: dto.status_a && dto.status_b,
        bookAId: dto.book_a_id.toString(),
        bookBId: dto.book_b_id.toString()
      });
      return this.mergeLocalTradeState(this.mapTrade({ id, ...dto }));
    }
  }

  async requesterAcceptTrade(trade: Trade): Promise<Trade> {
    this.saveLocalTradeState(trade.id, {
      statusA: true,
      statusB: true,
      statusTotal: true
    });
    return this.mergeLocalTradeState(trade);
  }

  async getChats(): Promise<ChatThread[]> {
    const raw = localStorage.getItem('ns_chats');
    return raw ? JSON.parse(raw) : [];
  }

  async addMessage(tradeId: string, message: Message): Promise<void> {
    const chats = await this.getChats();
    const current = chats.find(chat => chat.tradeId === tradeId);
    if (current) {
      current.messages.push(message);
    } else {
      chats.push({ tradeId, messages: [message] });
    }
    localStorage.setItem('ns_chats', JSON.stringify(chats));
  }

  async getTransactions(): Promise<Transaction[]> {
    const trades = await this.getTrades();
    return trades.map(trade => ({
      id: trade.id,
      description: `Troca: ${trade.bookTitle || 'Livro'}`,
      date: 'Em andamento',
      amount: 0,
      type: 'earn' as const
    }));
  }
}

export const dbService = new DBService();
