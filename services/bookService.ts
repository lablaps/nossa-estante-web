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
    const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
    const cleanText = (value?: string) => value?.replace(/^\[|\]$/g, '').trim();

    try {
      const bibKey = `ISBN:${cleanIsbn}`;
      const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=${bibKey}&format=json&jscmd=data`);

      const bookData = response.data[bibKey];

      if (bookData) {
        return {
          title: bookData.title,
          authors: bookData.authors?.map((a: any) => a.name) || [],
          publisher: bookData.publishers?.[0]?.name,
          publishedDate: bookData.publish_date,
          description: typeof bookData.notes === 'string' ? bookData.notes : undefined,
          pageCount: bookData.number_of_pages,
          thumbnail: bookData.cover?.medium || bookData.cover?.large,
          categories: bookData.subjects?.map((s: any) => s.name) || [],
          language: bookData.languages?.[0]?.key?.split('/').pop(),
          edition: undefined, // by_statement is generic and often incorrect for 'edition' field
          physicalFormat: bookData.physical_format,
          publishPlace: cleanText(bookData.publish_places?.[0]?.name)
        };
      }
    } catch (error) {
      console.error('Error fetching book from Open Library:', error);
    }

    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
      const volume = response.data?.items?.[0]?.volumeInfo;

      if (volume) {
        return {
          title: volume.title,
          authors: volume.authors || [],
          publisher: volume.publisher,
          publishedDate: volume.publishedDate,
          description: volume.description,
          pageCount: volume.pageCount,
          thumbnail: volume.imageLinks?.thumbnail?.replace('http://', 'https://'),
          categories: volume.categories || [],
          language: volume.language
        };
      }
    } catch (error) {
      console.error('Error fetching book from Google Books:', error);
    }

    return null;
  }
};
