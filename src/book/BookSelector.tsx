import React from 'react';
import BookService, { IBook, IChapter, ITranslation, IVerse } from './BookService';

interface IState {
    selectedBook: number;
    isLoadingBooks: boolean;
    books: IBook[];
    selectedChapter: number;
    isLoadingChapters: boolean;
    chapters: IChapter[];
    selectedVerse: number;
    isLoadingVerses: boolean;
    verses: IVerse[];
    disablePrevBtn: boolean;
    disableNextBtn: boolean;
}

interface IProps {
    selectedTranslation: ITranslation;
    selectedBook: number;
    selectedChapter: number;
    selectedVerse: number;
    onChange: (book: IBook, chapterId: number, verse: IVerse) => void;
    showNavButtons: boolean;
    showVerses: boolean;
}

class BookSelector extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            selectedBook: this.props.selectedBook,
            isLoadingBooks: true,
            books: [],
            selectedChapter: this.props.selectedChapter,
            isLoadingChapters: true,
            chapters: [],
            selectedVerse: this.props.selectedVerse,
            isLoadingVerses: true,
            verses: [],
            disablePrevBtn: true,
            disableNextBtn: true,
        };
    }

    protected handleKeyDown(event: KeyboardEvent) {
        // TODO: Only do this when the user is on the book page

        if (this.state.isLoadingBooks || this.state.isLoadingChapters || this.state.isLoadingVerses) {
            return;
        }

        switch (event.key) {
            case 'ArrowLeft':
                if (!this.state.disablePrevBtn) {
                    this.previous();
                }
                break;
            case 'ArrowRight':
                if (!this.state.disableNextBtn) {
                    this.next();
                }
                break;
        }
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (prevProps.selectedTranslation.abbreviation !== this.props.selectedTranslation.abbreviation) {
            this.getVerses(this.state.selectedBook, this.state.selectedChapter).then(() => {
                this.emit(this.state.selectedBook, this.state.selectedChapter, this.state.selectedVerse);
            });
        }
    }

    public componentWillUnmount() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    public componentDidMount() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        this.setState({
            disablePrevBtn: this.disablePrev(this.props.selectedChapter),
            disableNextBtn: this.disableNext(this.props.selectedChapter),
            isLoadingBooks: true,
            isLoadingChapters: true,
            isLoadingVerses: true,
        });

        const bookService = new BookService();

        bookService
            .getAll()
            .then(
                (result) => {
                    this.setState({
                        books: result,
                    });
                },
                (error) => {
                    console.warn(error);

                    this.setState({
                        books: [],
                    });
                },
            )
            .then(() => this.getChapters(this.state.selectedBook))
            .then(() => this.getVerses(this.state.selectedBook, this.state.selectedChapter));
    }

    protected getChapters(bookId: number) {
        const service = new BookService();

        return service.getChapters(bookId).then(
            (result) => {
                this.setState({
                    chapters: result,
                });
            },
            (error) => {
                console.warn(error);

                this.setState({
                    chapters: [],
                });
            },
        );
    }

    protected getVerses(bookId: number, chapterId: number) {
        const service = new BookService();

        return service.getText(bookId, chapterId, this.props.selectedTranslation.abbreviation).then(
            (result) => {
                this.setState({
                    isLoadingBooks: false,
                    isLoadingChapters: false,
                    isLoadingVerses: false,
                    verses: result,
                });
            },
            (error) => {
                console.warn(error);

                this.setState({
                    isLoadingBooks: false,
                    isLoadingChapters: false,
                    isLoadingVerses: false,
                    verses: [],
                });
            },
        );
    }

    protected onChangeBook = (event: React.FormEvent<HTMLSelectElement>) => {
        const newBook = parseInt(event.currentTarget.value);

        this.changeBook(newBook, 1);
    };

    protected changeBook(newBook: number, newChapter: number) {
        this.setState({
            isLoadingBooks: true,
            isLoadingChapters: true,
            isLoadingVerses: true,
            selectedChapter: newChapter,
            selectedBook: newBook,
            selectedVerse: 1,
        });

        this.getChapters(newBook)
            .then(() => this.getVerses(newBook, newChapter))
            .then(() => {
                this.setState({
                    disablePrevBtn: this.disablePrev(newChapter),
                    disableNextBtn: this.disableNext(newChapter),
                });

                this.emit(newBook, newChapter, 1);
            });
    }

    protected disablePrev(chapter: number): boolean {
        return this.state.selectedBook === 1 && chapter === 1;
    }

    protected disableNext(chapter: number): boolean {
        return this.state.selectedBook === 66 && chapter === 22;
    }

    protected onChangeChapter = (event: React.FormEvent<HTMLSelectElement>) => {
        const newChapter = parseInt(event.currentTarget.value);

        this.getVerses(this.state.selectedBook, newChapter).then(() => {
            this.setState({
                selectedChapter: newChapter,
                selectedVerse: 1,
                disablePrevBtn: this.disablePrev(newChapter),
                disableNextBtn: this.disableNext(newChapter),
            });

            this.emit(this.state.selectedBook, newChapter, 1);
        });
    };

    protected onChangeVerse = (event: React.FormEvent<HTMLSelectElement>) => {
        const newVerse = parseInt(event.currentTarget.value);

        this.setState({
            selectedVerse: newVerse,
        });

        this.emit(this.state.selectedBook, this.state.selectedChapter, newVerse);
    };

    protected next() {
        if (!this.props.showNavButtons) {
            return;
        }

        const newChapter = this.state.selectedChapter + 1;

        if (newChapter > this.state.chapters.length) {
            const newBook = this.state.selectedBook + 1;

            this.changeBook(newBook, 1);

            this.emit(newBook, 1, 1);

            return;
        }

        this.setState({
            selectedChapter: newChapter,
            disablePrevBtn: this.disablePrev(newChapter),
            disableNextBtn: this.disableNext(newChapter),
        });

        this.emit(this.state.selectedBook, newChapter, 1);
    }

    protected emit(bookId: number, chapterId: number, verseId: number) {
        let bookIndex = 0;
        let verseIndex = 0;

        for (let i = 0; i < this.state.books.length; i++) {
            if (bookId === this.state.books[i].id) {
                bookIndex = i;
                break;
            }
        }

        for (let i = 0; i < this.state.verses.length; i++) {
            if (verseId === this.state.verses[i].verseId) {
                verseIndex = i;
                break;
            }
        }

        this.props.onChange(this.state.books[bookIndex], chapterId, this.state.verses[verseIndex]);
    }

    protected previous() {
        if (!this.props.showNavButtons) {
            return;
        }

        const newChapter = this.state.selectedChapter - 1;

        if (newChapter < 1) {
            const newBook = this.state.selectedBook - 1;

            this.getChapters(newBook).then(() => {
                this.changeBook(newBook, this.state.chapters.length);

                this.emit(newBook, this.state.chapters.length, 1);
            });

            return;
        }

        this.setState({
            selectedChapter: newChapter,
            disablePrevBtn: this.disablePrev(newChapter),
            disableNextBtn: this.disableNext(newChapter),
        });

        this.emit(this.state.selectedBook, newChapter, 1);
    }

    public render(): JSX.Element {
        const oldTestBooks = this.state.books.map((book: IBook) => {
            if (book.testament !== 'OT') {
                return;
            }

            return (
                <option key={book.id} value={book.id}>
                    {book.name}
                </option>
            );
        });

        const newTestBooks = this.state.books.map((book: IBook) => {
            if (book.testament !== 'NT') {
                return;
            }

            return (
                <option key={book.id} value={book.id}>
                    {book.name}
                </option>
            );
        });

        const chapters = this.state.chapters.map((chapter: IChapter) => (
            <option key={chapter.id} value={chapter.id}>
                {chapter.id}
            </option>
        ));

        const verses = this.state.verses.map((verse: IVerse) => (
            <option key={verse.id} value={verse.verseId}>
                {verse.verseId}
            </option>
        ));

        return (
            <div className="book-selector-widget">
                <div className="row">
                    <div className="col-8 pr-1">
                        <select
                            name="selectedBook"
                            id="selectedBook"
                            disabled={this.state.isLoadingBooks}
                            value={this.state.selectedBook}
                            onChange={this.onChangeBook}
                        >
                            <optgroup label="Old Testament">{oldTestBooks}</optgroup>
                            <optgroup label="New Testament">{newTestBooks}</optgroup>
                        </select>
                    </div>

                    <div className={`${this.props.showVerses ? 'col-2' : 'col-4 pl-1'}`}>
                        <select
                            name="selectedChapter"
                            id="selectedChapter"
                            disabled={this.state.isLoadingChapters}
                            value={this.state.selectedChapter}
                            onChange={this.onChangeChapter}
                        >
                            {chapters}
                        </select>
                    </div>

                    <div className="col-2 pl-1" style={{ display: this.props.showVerses ? 'block' : 'none' }}>
                        <select
                            name="selectedVerse"
                            id="selectedVerse"
                            disabled={this.state.isLoadingVerses}
                            value={this.state.selectedVerse}
                            onChange={this.onChangeVerse}
                        >
                            {verses}
                        </select>
                    </div>

                    <div className="col-6 pr-1 mt-3" style={{ display: this.props.showNavButtons ? 'block' : 'none' }}>
                        <button
                            disabled={this.state.isLoadingBooks || this.state.disablePrevBtn}
                            onClick={() => this.previous()}
                            className="btn btn-primary btn-block"
                        >
                            Previous
                        </button>
                    </div>
                    <div className="col-6 pl-1 mt-3" style={{ display: this.props.showNavButtons ? 'block' : 'none' }}>
                        <button
                            disabled={this.state.isLoadingBooks || this.state.disableNextBtn}
                            onClick={() => this.next()}
                            className="btn btn-primary btn-block"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default BookSelector;
