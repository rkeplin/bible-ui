import React from 'react';

interface IState {
    selectedBook: number;
    isLoadingBooks: boolean;
    books: [];
    selectedChapter: number;
    isLoadingChapters: boolean;
    chapters: [];
    disablePrevBtn: boolean;
    disableNextBtn: boolean;
}

interface IBook {
    id: number;
    testament: string;
    name: string;
}

interface IChapter {
    id: number;
}

class BookSelector extends React.Component<any, IState> {
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

    componentDidMount() {
        this.setState({
            isLoadingBooks: true,
            isLoadingChapters: true,
        });

        fetch('http://bible-go-api.rkeplin.local/v1/books')
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);
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

    getChapters(bookId: number): void {
        fetch(`http://bible-go-api.rkeplin.local/v1/books/${bookId}/chapters`)
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);
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

    onChangeBook = (event: React.FormEvent<HTMLSelectElement>) => {
        const newBook = parseInt(event.currentTarget.value);

        this.setState({
            isLoadingBooks: true,
            isLoadingChapters: true,
            selectedChapter: 1,
            selectedBook: newBook,
            disablePrevBtn: newBook === 1,
        });

        this.getChapters(newBook);
    };

    onChangeChapter = (event: React.FormEvent<HTMLSelectElement>) => {
        const newChapter = parseInt(event.currentTarget.value);

        this.setState({
            selectedChapter: newChapter,
            disablePrevBtn: this.state.selectedBook === 1 && newChapter === 1,
            disableNextBtn: this.state.selectedBook === 66 && newChapter === 22,
        });
    };

    render(): JSX.Element {
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
                            ng-click="vm.onPreviousClick()"
                            className="btn btn-primary btn-block"
                        >
                            Previous
                        </button>
                    </div>
                    <div className="col-6 pl-1 mt-3">
                        <button
                            disabled={this.state.isLoadingBooks || this.state.disableNextBtn}
                            ng-click="vm.onNextClick()"
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
