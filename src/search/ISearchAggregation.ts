import { IBook } from '../book/BookService';

interface ISearchAggregation {
    book: IBook;
    hits: number;
}

export default ISearchAggregation;
