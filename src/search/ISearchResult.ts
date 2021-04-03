import { IVerse } from '../book/BookService';

interface ISearchResult {
    items: IVerse[];
    total: number;
}

export default ISearchResult;
