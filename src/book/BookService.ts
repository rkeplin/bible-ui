import Config from '../Config';
import HttpService from '../core/HttpService';

export interface IBook {
    id: number;
    testament: string;
    name: string;
}

export interface ITranslation {
    abbreviation: string;
    id: number;
    version: string;
}

export interface IVerse {
    book: IBook;
    chapterId: number;
    id: number;
    verse: string;
    verseId: number;
    highlight: boolean;
    translation?: string;
}

export interface IChapter {
    id: number;
}

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

    public async getVerse(
        bookId: number,
        chapterId: number,
        verseId: number,
        translationAbbr: string,
    ): Promise<IVerse> {
        return this.httpClient
            .get(
                'books/' +
                    bookId +
                    '/chapters/' +
                    chapterId +
                    '/' +
                    verseId +
                    '?translation=' +
                    translationAbbr.toLowerCase(),
            )
            .then((response: any): IVerse => {
                const verse: IVerse = {
                    book: {
                        id: bookId,
                        testament: '',
                        name: '',
                    },
                    chapterId: chapterId,
                    id: verseId,
                    verse: '',
                    verseId: 0,
                    highlight: false,
                    translation: translationAbbr.toUpperCase(),
                };

                if (response.status !== 200) {
                    return verse;
                }

                if (response.data.length < 1) {
                    return verse;
                }

                verse.book = response[0].book;
                verse.id = response[0].id;
                verse.verse = response[0].verse;
                verse.verseId = response[0].verseId;
                verse.translation = response[0].translation;

                return verse;
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
