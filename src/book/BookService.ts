import Config from '../Config';
import HttpService from '../core/HttpService';
import IBook from './IBook';
import IChapter from './IChapter';
import IVerse from './IVerse';

class BookService extends HttpService {
    protected bookCache: IBook;

    constructor() {
        super(Config.API);

        this.bookCache = this.getDefaultBook();
    }

    public async getText(bookId: number, chapterId: number, translationAbbr: string): Promise<IVerse[]> {
        return this.httpClient
            .get('books/' + bookId + '/chapters/' + chapterId + '?translation=' + translationAbbr.toLowerCase())
            .then((response) => {
                const collection: IVerse[] = [];

                if (response.status !== 200) {
                    return collection;
                }

                for (let i = 0; i < response.data.length; i++) {
                    collection.push(response.data[i]);
                }

                return collection;
            });
    }

    public async getCrossReferences(
        verseId: number | undefined,
        translationAbbr: string | undefined,
    ): Promise<IVerse[][]> {
        return this.httpClient
            .get('verse/' + verseId + '/relations?translation=' + translationAbbr?.toLowerCase())
            .then((response) => {
                const collection: IVerse[][] = [];

                if (response.status !== 200) {
                    return collection;
                }
                return response.data;
            });
    }

    public async getChapters(bookId: number): Promise<IChapter[]> {
        return this.httpClient.get('books/' + bookId + '/chapters').then((response) => {
            const collection: IChapter[] = [];

            if (response.status !== 200) {
                return collection;
            }

            for (let i = 0; i < response.data.length; i++) {
                collection.push({
                    id: response.data[i].id,
                });
            }

            return collection;
        });
    }

    public async getAll(): Promise<IBook[]> {
        return this.httpClient.get('books').then((response) => {
            const books: IBook[] = [];

            if (response.status !== 200) {
                return books;
            }

            for (let i = 0; i < response.data.length; i++) {
                books.push({
                    id: response.data[i].id,
                    testament: response.data[i].testament,
                    name: response.data[i].name,
                });
            }

            return books;
        });
    }

    public async get(bookId: number): Promise<IBook> {
        if (this.bookCache.id == bookId) {
            return this.bookCache;
        }

        const book: IBook = this.getDefaultBook();

        return this.httpClient.get('books/' + bookId).then((response) => {
            if (response.status !== 200) {
                return book;
            }

            book.id = response.data.id;
            book.testament = response.data.testament;
            book.name = response.data.name;

            this.bookCache = book;

            return book;
        });
    }

    public getDefaultBook(): IBook {
        return {
            id: 1,
            testament: 'OT',
            name: 'Genesis',
        };
    }
}

export default BookService;
