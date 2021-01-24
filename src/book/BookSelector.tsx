import React from 'react';
import Config from '../Config';
import IBook from './IBook';

interface IState {
    selectedBook: number;
    isLoadingBooks: boolean;
    books: IBook[];
    selectedChapter: number;
    isLoadingChapters: boolean;
    chapters: [];
    disablePrevBtn: boolean;
    disableNextBtn: boolean;
}

interface IProps {
    onChange: (book: IBook, chapterId: number) => void;
}

interface IChapter {
    id: number;
}

class BookSelector extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            selectedBook: 1,
            isLoadingBooks: true,
            books: [],
            selectedChapter: 1,
            isLoadingChapters: true,
            chapters: [],
            disablePrevBtn: true,
            disableNextBtn: false,
        };
    }

    private handleKeyDown(event: KeyboardEvent) {
        // TODO: Only do this when the left nav is open, and the user is on the book page

        if (this.state.isLoadingBooks || this.state.isLoadingChapters) {
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

    public componentWillUnmount() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    public componentDidMount() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        this.setState({
            isLoadingBooks: true,
            isLoadingChapters: true,
        });

        fetch(`${Config.API}/books`)
            .then((res) => res.json())
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
            .then(() => this.getChapters(1));
    }

    private getChapters(bookId: number) {
        return fetch(`${Config.API}/books/${bookId}/chapters`)
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoadingBooks: false,
                        isLoadingChapters: false,
                        chapters: result,
                    });
                },
                (error) => {
                    console.warn(error);

                    this.setState({
                        isLoadingBooks: false,
                        isLoadingChapters: false,
                        chapters: [],
                    });
                },
            );
    }

    private onChangeBook = (event: React.FormEvent<HTMLSelectElement>) => {
        const newBook = parseInt(event.currentTarget.value);

        this.changeBook(newBook, 1);
    };

    private changeBook(newBook: number, newChapter: number) {
        this.setState({
            isLoadingBooks: true,
            isLoadingChapters: true,
            selectedChapter: newChapter,
            selectedBook: newBook,
        });

        this.getChapters(newBook).then(() => {
            this.setState({
                disablePrevBtn: this.disablePrev(newChapter),
                disableNextBtn: this.disableNext(newChapter),
            });

            this.emit(newBook, newChapter);
        });
    }

    private disablePrev(chapter: number): boolean {
        return this.state.selectedBook === 1 && chapter === 1;
    }

    private disableNext(chapter: number): boolean {
        return this.state.selectedBook === 66 && chapter === 22;
    }

    private onChangeChapter = (event: React.FormEvent<HTMLSelectElement>) => {
        const newChapter = parseInt(event.currentTarget.value);

        this.setState({
            selectedChapter: newChapter,
            disablePrevBtn: this.disablePrev(newChapter),
            disableNextBtn: this.disableNext(newChapter),
        });

        this.emit(this.state.selectedBook, newChapter);
    };

    private next() {
        const newChapter = this.state.selectedChapter + 1;

        if (newChapter > this.state.chapters.length) {
            const newBook = this.state.selectedBook + 1;

            this.changeBook(newBook, 1);

            this.emit(newBook, 1);

            return;
        }

        this.setState({
            selectedChapter: newChapter,
            disablePrevBtn: this.disablePrev(newChapter),
            disableNextBtn: this.disableNext(newChapter),
        });

        this.emit(this.state.selectedBook, newChapter);
    }

    private emit(bookId: number, chapterId: number) {
        for (let i = 0; i < this.state.books.length; i++) {
            if (bookId === this.state.books[i].id) {
                this.props.onChange(this.state.books[i], chapterId);
                break;
            }
        }
    }

    private previous() {
        const newChapter = this.state.selectedChapter - 1;

        if (newChapter < 1) {
            const newBook = this.state.selectedBook - 1;

            this.getChapters(newBook).then(() => {
                this.changeBook(newBook, this.state.chapters.length);

                this.emit(newBook, this.state.chapters.length);
            });

            return;
        }

        this.setState({
            selectedChapter: newChapter,
            disablePrevBtn: this.disablePrev(newChapter),
            disableNextBtn: this.disableNext(newChapter),
        });

        this.emit(this.state.selectedBook, newChapter);
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
                    <div className="col-4 pl-1">
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

                    <div className="col-6 pr-1 mt-3">
                        <button
                            disabled={this.state.isLoadingBooks || this.state.disablePrevBtn}
                            onClick={() => this.previous()}
                            className="btn btn-primary btn-block"
                        >
                            Previous
                        </button>
                    </div>
                    <div className="col-6 pl-1 mt-3">
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
