import React from 'react';
import { RouteComponentProps, withRouter, match } from 'react-router-dom';
import ListService, { IList } from './ListService';
import IVerse from '../book/IVerse';
import { AxiosError } from 'axios';
import TranslationSelector from '../book/TranslationSelector';
import ITranslation from '../book/ITranslation';
import TranslationService from '../book/TranslationService';
import BookSelector from '../book/BookSelector';
import IBook from '../book/IBook';
import BookService from '../book/BookService';
import FormError, { IFormError } from '../core/FormError';

interface IState {
    isLoadingList: boolean;
    isLoading: boolean;
    list: IList;
    verses: IVerse[];
    selectedVerse: IVerse;
    allowAdd: boolean;
    displayAddDialog: boolean;
    displayDeleteDialog: boolean;
    selectedTranslation: ITranslation;
    selectedBookId: number;
    selectedChapterId: number;
    selectedVerseId: number;
    verseToAdd: IVerse;
    addError: IFormError;
    deleteError: IFormError;
}

interface IParams {
    listId: string;
}

interface IMatch extends match<any> {
    params: IParams;
}

interface IProps extends RouteComponentProps {
    match: IMatch;
}

class ListContent extends React.Component<IProps, IState> {
    protected listService: ListService;
    protected translationService: TranslationService;
    protected bookService: BookService;

    constructor(props: any) {
        super(props);

        this.listService = new ListService();
        this.bookService = new BookService();
        this.translationService = new TranslationService();

        this.state = {
            isLoadingList: true,
            isLoading: false,
            list: {
                id: '',
                name: '',
                dateAdded: '',
                dateUpdated: '',
            },
            selectedVerse: {
                book: {
                    id: 0,
                    testament: '',
                    name: '',
                },
                chapterId: 0,
                id: 0,
                verse: '',
                verseId: 0,
                highlight: false,
            },
            verses: [],
            allowAdd: true,
            displayAddDialog: false,
            displayDeleteDialog: false,
            selectedTranslation: this.translationService.getDefaultTranslation(),
            selectedBookId: 1,
            selectedChapterId: 1,
            selectedVerseId: 1,
            verseToAdd: {
                book: {
                    id: 1,
                    testament: 'OT',
                    name: 'Genesis',
                },
                chapterId: 1,
                id: 1001001,
                verse: 'In the beginning God created the heaven and the earth.',
                verseId: 1,
                highlight: false,
            },
            addError: {
                hasError: false,
                errorDescription: '',
                errors: [],
            },
            deleteError: {
                hasError: false,
                errorDescription: '',
                errors: [],
            },
        };
    }

    protected clearDialogs() {
        this.setState({
            displayAddDialog: false,
            displayDeleteDialog: false,
        });
    }

    public onWindowKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Escape':
                this.clearDialogs();
                break;
        }
    }

    private onAddClick(event: React.MouseEvent) {
        event.preventDefault();

        if (!this.state.allowAdd || this.state.isLoading || this.state.isLoadingList) {
            return;
        }

        this.setState({
            displayAddDialog: true,
        });
    }

    private onDeleteClick(event: React.MouseEvent, verse: IVerse) {
        event.preventDefault();

        this.setState({
            selectedVerse: verse,
            displayDeleteDialog: true,
        });
    }

    private remove(verse: IVerse) {
        console.log(verse);
    }

    private load() {
        this.setState({
            isLoadingList: true,
        });

        this.listService
            .getOne(this.props.match.params.listId)
            .then((list: IList) => {
                this.setState({
                    list: list,
                });
            })
            .catch((error: AxiosError) => {
                this.handleError(error);
            });

        this.listService
            .getVerses(this.props.match.params.listId)
            .then((verses) => {
                this.setState({
                    isLoadingList: false,
                    verses: verses,
                });
            })
            .catch((error: AxiosError) => {
                this.handleError(error);
            });
    }

    public handleError(error: AxiosError) {
        if (error.response?.status === 401) {
            this.props.history.push('/user/login');

            window.scrollTo(0, 0);
        }
    }

    public componentDidMount() {
        this.load();

        window.addEventListener('keydown', (event: KeyboardEvent) => this.onWindowKeyDown(event), false);
    }

    public componentWillUnmount() {
        window.removeEventListener('keydown', (event: KeyboardEvent) => this.onWindowKeyDown(event), false);
    }

    public onChangeTranslation(translation: ITranslation) {
        this.setState({
            selectedTranslation: translation,
        });
    }

    public onChangeBook(book: IBook, chapterId: number, verse: IVerse) {
        this.setState({
            verseToAdd: verse,
        });
    }

    public render(): JSX.Element {
        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        {this.state.list.name || 'Loading...'}

                        <button
                            className="btn btn-secondary btn-sm pull pull-right"
                            disabled={!this.state.allowAdd || this.state.isLoading || this.state.isLoadingList}
                            onClick={(event: React.MouseEvent) => this.onAddClick(event)}
                        >
                            Add Verse
                        </button>
                    </div>
                    <div className="card-body">
                        <div
                            style={{
                                display: !this.state.verses.length && !this.state.isLoadingList ? 'block' : 'none',
                            }}
                        >
                            There are no verses on this list yet.{' '}
                            <a
                                href=""
                                style={{ display: this.state.allowAdd ? 'inline-block' : 'none' }}
                                onClick={(event: React.MouseEvent) => this.onAddClick(event)}
                            >
                                Add a verse.
                            </a>
                        </div>

                        <div style={{ display: this.state.isLoadingList ? 'block' : 'none' }}>Loading...</div>

                        {this.state.verses.map((verse: IVerse, index: number) => {
                            return (
                                <div className="well bg-gray mb20 p15" key={index}>
                                    <p>
                                        <b>{verse.book.name}</b> -{' '}
                                        <i>
                                            {verse.book.testament} ({verse.translation})
                                        </i>
                                        <a
                                            className="pull pull-right"
                                            title="Remove from list"
                                            href=""
                                            onClick={(event: React.MouseEvent) => this.onDeleteClick(event, verse)}
                                        >
                                            [x]
                                        </a>
                                    </p>
                                    <p>
                                        <b>
                                            <a href="">
                                                {verse.chapterId}:{verse.verseId}
                                            </a>
                                        </b>
                                        {verse.verse}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="overlay" style={{ display: this.state.displayAddDialog ? 'block' : 'none' }}>
                    <div className="dialog">
                        <FormError
                            hasError={this.state.addError.hasError}
                            errorDescription={this.state.addError.errorDescription}
                            errors={this.state.addError.errors}
                        />

                        <div className="card">
                            <div className="card-header">Add Verse</div>
                            <div className="card-body">
                                <TranslationSelector
                                    selectedTranslation={this.state.selectedTranslation}
                                    onChange={(translation: ITranslation) => this.onChangeTranslation(translation)}
                                ></TranslationSelector>

                                <div className="mt-3 mb-3">
                                    <b>
                                        {this.state.verseToAdd.book.name.toUpperCase()}{' '}
                                        {this.state.verseToAdd.chapterId}:{this.state.verseToAdd.verseId}
                                    </b>
                                    &nbsp;
                                    {this.state.verseToAdd.verse}
                                </div>

                                <BookSelector
                                    selectedTranslation={this.state.selectedTranslation}
                                    selectedBook={this.state.selectedBookId}
                                    selectedChapter={this.state.selectedChapterId}
                                    selectedVerse={this.state.selectedVerseId}
                                    showVerses={true}
                                    showNavButtons={false}
                                    onChange={(book: IBook, chapterId: number, verse: IVerse) =>
                                        this.onChangeBook(book, chapterId, verse)
                                    }
                                />
                            </div>
                            <div className="card-footer text-right">
                                <button
                                    className="btn btn-default mr-2"
                                    onClick={() => this.setState({ displayAddDialog: false })}
                                >
                                    No
                                </button>
                                <button
                                    className="btn btn-primary"
                                    disabled={this.state.isLoading}
                                    onClick={() => alert('adding')}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overlay" style={{ display: this.state.displayDeleteDialog ? 'block' : 'none' }}>
                    <div className="dialog">
                        <FormError
                            hasError={this.state.deleteError.hasError}
                            errorDescription={this.state.deleteError.errorDescription}
                            errors={this.state.deleteError.errors}
                        />

                        <div className="card">
                            <div className="card-header">Remove Verse</div>
                            <div className="card-body">
                                Are you sure that you want to remove{' '}
                                <b>
                                    {this.state.selectedVerse.book.name} {this.state.selectedVerse.chapterId}:
                                    {this.state.selectedVerse.verseId} ({this.state.selectedVerse.translation})
                                </b>{' '}
                                from this list?
                            </div>
                            <div className="card-footer text-right">
                                <button
                                    className="btn btn-default mr-2"
                                    onClick={() => this.setState({ displayDeleteDialog: false })}
                                >
                                    No
                                </button>
                                <button
                                    className="btn btn-primary"
                                    disabled={this.state.isLoading}
                                    onClick={() => this.remove(this.state.selectedVerse)}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ListContent);
