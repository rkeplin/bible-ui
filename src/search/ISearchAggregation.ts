import IBook from '../book/IBook';

interface ISearchAggregation {
    book: IBook;
    hits: number;
}

export default ISearchAggregation;
