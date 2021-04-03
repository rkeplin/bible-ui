import React from 'react';
import { RouteComponentProps, withRouter, match } from 'react-router-dom';
import ListService, { IList, IListVerse } from './ListService';
import { AxiosError } from 'axios';
import TranslationSelector from '../book/TranslationSelector';
import TranslationService from '../book/TranslationService';
import BookSelector from '../book/BookSelector';
import BookService, { IBook, ITranslation, IVerse } from '../book/BookService';
import FormError, { IFormError } from '../core/FormError';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IState {
    isLoadingList: boolean;
    isLoading: boolean;
    list: IList;
    verseList: IListVerse[];
    selectedVerse: IListVerse;
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
                dateAdded: '',
                id: '',
                list: {
                    id: '',
                },
                text: {
                    id: 0,
                    book: {
                        id: 0,
                        testament: '',
                        name: '',
                    },
                    chapterId: 0,
                    verse: '',
                    verseId: 0,
                    highlight: false,
                },
                translation: '',
                user: {
                    id: '',
                    email: '',
                },
            },
            verseList: [],
            allowAdd: true,
            displayAddDialog: false,
            displayDeleteDialog: false,
            selectedTranslation: this.translationService.getDefaultTranslation(),
            selectedBookId: 1,
            selectedChapterId: 1,
            selectedVerseId: 1,
            verseToAdd: this.initVerse(),
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

    protected initVerse(): IVerse {
        return {
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
        };
    }

    protected clearDialogs() {
        this.setState({
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
            displayAddDialog: false,
            displayDeleteDialog: false,
        });
    }

    protected onWindowKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Escape':
                this.clearDialogs();
                break;
        }
    }

    protected onAddClick(event: React.MouseEvent) {
        event.preventDefault();

        if (!this.state.allowAdd || this.state.isLoading || this.state.isLoadingList) {
            return;
        }

        this.setState({
            displayAddDialog: true,
        });
    }

    protected onDeleteClick(event: React.MouseEvent, listVerse: IListVerse) {
        event.preventDefault();

        this.setState({
            selectedVerse: listVerse,
            displayDeleteDialog: true,
        });
    }

    protected remove(listVerse: IListVerse) {
        this.listService
            .removeVerse(this.props.match.params.listId, listVerse.text.id, listVerse.translation)
            .then(() => {
                this.setState({
                    displayDeleteDialog: false,
                });
            })
            .then(() => this.load())
            .catch((error: AxiosError) => {
                this.handleError(error);
            });
    }

    protected load() {
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
            .then((verseList) => {
                this.setState({
                    isLoadingList: false,
                    verseList: verseList,
                });
            })
            .catch((error: AxiosError) => {
                this.handleError(error);
            });
    }

    protected addVerse() {
        if (!this.state.verseToAdd.id) {
            return;
        }

        if (!this.state.selectedTranslation.id) {
            return;
        }

        this.listService
            .addVerse(
                this.props.match.params.listId,
                this.state.verseToAdd.id,
                this.state.selectedTranslation.abbreviation,
            )
            .then((verse) => {
                this.setState({
                    displayAddDialog: false,
                    verseToAdd: this.initVerse(),
                });
            })
            .then(() => this.load())
            .catch((error: AxiosError) => {
                this.handleError(error);

                this.setState({
                    addError: {
                        hasError: true,
                        errorDescription: error.response?.data?.description
                            ? error.response?.data?.description
                            : 'Error',
                        errors: error.response?.data?.errors ? error.response?.data?.errors : [],
                    },
                });
            });
    }

    protected handleError(error: AxiosError) {
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

    protected onChangeTranslation(translation: ITranslation) {
        this.setState({
            selectedTranslation: translation,
        });
    }

    protected onChangeBook(book: IBook, chapterId: number, verse: IVerse) {
        this.setState({
            verseToAdd: verse,
        });
    }

    public render(): JSX.Element {
        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        <a
                            href=""
                            onClick={(event: React.MouseEvent) => {
                                event.preventDefault();

                                this.props.history.push('/list');
                            }}
                        >
                            Lists
                        </a>{' '}
                        &raquo; {this.state.list.name || 'Loading...'}
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
                                display: !this.state.verseList.length && !this.state.isLoadingList ? 'block' : 'none',
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

                        {this.state.verseList.map((listVerse: IListVerse, index: number) => {
                            const url =
                                `/book/` +
                                listVerse.translation.toLowerCase() +
                                `/` +
                                listVerse.text.book.id +
                                `/` +
                                listVerse.text.chapterId +
                                `?verseId=` +
                                listVerse.text.verseId;

                            return (
                                <div className="well bg-gray mb20 p15" key={index}>
                                    <p>
                                        <b>{listVerse.text.book.name}</b> - <i>{listVerse.text.book.testament}</i>
                                        <button
                                            className="btn btn-primary btn-sm pull pull-right"
                                            title="Remove from list"
                                            onClick={(event: React.MouseEvent) => this.onDeleteClick(event, listVerse)}
                                        >
                                            <FontAwesomeIcon icon="minus-circle" />
                                        </button>
                                    </p>
                                    <p>
                                        <b>
                                            <a
                                                href=""
                                                onClick={(event: React.MouseEvent) => {
                                                    event.preventDefault();

                                                    this.props.history.push(url);
                                                }}
                                            >
                                                {listVerse.text.chapterId}:{listVerse.text.verseId}{' '}
                                                <i>({listVerse.translation})</i>
                                            </a>
                                        </b>{' '}
                                        {listVerse.text.verse}
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
                                <button className="btn btn-default mr-2" onClick={() => this.clearDialogs()}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    disabled={this.state.isLoading}
                                    onClick={() => this.addVerse()}
                                >
                                    Add
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
                                    {this.state.selectedVerse.text.book.name} {this.state.selectedVerse.text.chapterId}:
                                    {this.state.selectedVerse.text.verseId} ({this.state.selectedVerse.translation})
                                </b>{' '}
                                from this list?
                            </div>
                            <div className="card-footer text-right">
                                <button className="btn btn-default mr-2" onClick={() => this.clearDialogs()}>
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
