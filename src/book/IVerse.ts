import IBook from './IBook';

interface IVerse {
    book: IBook;
    chapterId: number;
    id: number;
    verse: string;
    verseId: number;
    highlight: boolean;
}

export default IVerse;
