import axios from 'axios';

export interface BookApiInfo {
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  thumbnail?: string;
  categories?: string[];
  language?: string;
  edition?: string;
  physicalFormat?: string;
  publishPlace?: string;
}

export const bookService = {
  fetchBookByISBN: async (isbn: string): Promise<BookApiInfo | null> => {
    try {
      const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
      const bibKey = `ISBN:${cleanIsbn}`;
      const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=${bibKey}&format=json&jscmd=data`);

      const bookData = response.data[bibKey];

      if (bookData) {
        return {
          title: bookData.title,
          authors: bookData.authors?.map((a: any) => a.name) || [],
          publisher: bookData.publishers?.[0]?.name,
          publishedDate: bookData.publish_date,
          description: typeof bookData.notes === 'string' ? bookData.notes : (bookData.subjects?.map((s: any) => s.name).join(', ')),
          pageCount: bookData.number_of_pages,
          thumbnail: bookData.cover?.medium || bookData.cover?.large,
          categories: bookData.subjects?.map((s: any) => s.name) || [],
          language: bookData.languages?.[0]?.key?.split('/').pop() || 'pt',
          edition: bookData.by_statement, // Statement as fallback or check more fields
          physicalFormat: bookData.physical_format,
          publishPlace: bookData.publish_places?.[0]?.name
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching book from Open Library:', error);
      return null;
    }
  }
};
