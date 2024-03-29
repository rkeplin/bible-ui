import React from 'react';
import TranslationSelector from './book/TranslationSelector';
import BookSelector from './book/BookSelector';
import KeywordSearch from './book/KeywordSearch';
import UserMenu from './user/UserMenu';
import TextDisplay from './book/TextDisplay';
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import URLParser from './book/URLParser';
import BookService, { IBook, ITranslation, IVerse } from './book/BookService';
import TranslationService from './book/TranslationService';
import SearchResults from './search/SearchResults';
import LoginForm from './user/LoginForm';
import RegistrationForm from './user/RegistrationForm';
import Logout from './user/Logout';
import ManageLists from './list/ManageLists';
import ListContent from './list/ListContent';
import UserService from './user/UserService';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faList, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { History, UnregisterCallback } from 'history';

library.add(faEdit, faList, faMinusCircle);

interface ISearch {
    isLoading: boolean;
    search: string;
}

interface IState {
    title: string;
    subTitle: string;
    translation: ITranslation;
    book: IBook;
    chapterId: number;
    verseId: number;
    isNavOpen: boolean;
    tmpIsNavOpen: boolean;
    search: ISearch;
    loggedIn: boolean;
}

class App extends React.Component<RouteComponentProps, IState> {
    protected history: History;

    protected unlisten: UnregisterCallback;

    protected bookService: BookService;

    protected translationService: TranslationService;

    protected userService: UserService;

    constructor(props: RouteComponentProps) {
        super(props);

        this.bookService = new BookService();
        this.translationService = new TranslationService();
        this.userService = new UserService();
        this.unlisten = () => void 0;

        this.history = this.props.history;

        const parser = new URLParser(this.props.location.pathname, this.props.location.search);

        this.state = {
            title: 'Loading',
            subTitle: '...',
            translation: {
                id: 0,
                abbreviation: parser.getTranslation(),
                version: '',
            },
            book: {
                id: parser.getBookId(),
                name: '',
                testament: '',
            },
            search: {
                isLoading: true,
                search: '',
            },
            chapterId: parser.getChapterId(),
            verseId: parser.getVerseId(),
            isNavOpen: true,
            tmpIsNavOpen: true,
            loggedIn: false,
        };
    }

    protected init(pathname: string, search: string) {
        if (pathname.startsWith('/user/login')) {
            this.setState({
                title: 'User',
                subTitle: ' - Login',
            });

            return;
        }

        if (pathname.startsWith('/user/logout')) {
            this.setState({
                title: 'User',
                subTitle: ' - Logging out',
                loggedIn: false,
            });

            return;
        }

        if (pathname.startsWith('/user/register')) {
            this.setState({
                title: 'User',
                subTitle: ' - Register',
            });

            return;
        }

        if (pathname == '/list') {
            this.setState({
                title: 'Manage Lists',
                subTitle: '',
            });

            return;
        }

        if (pathname.match(/^\/list\/[a-z0-9]+\/verses$/)) {
            this.setState({
                title: 'Manage Lists',
                subTitle: ' - Add Verses',
            });

            return;
        }

        if (pathname.startsWith('/book')) {
            // Skip if we aren't on the book page and the nav is closed
            const parser = new URLParser(pathname, search);

            let book: IBook;
            let translation: ITranslation;

            this.bookService
                .get(parser.getBookId())
                .then((result) => {
                    book = result;
                })
                .then(() => this.translationService.get(parser.getTranslation()))
                .then((result) => {
                    translation = result;
                })
                .then(() => {
                    this.setState({
                        translation: translation,
                        title: book.name,
                        subTitle: book.testament == 'OT' ? ' - Old Testament' : ' - New Testament',
                        book: book,
                        chapterId: parser.getChapterId(),
                        verseId: parser.getVerseId(),
                    });
                });
        }

        if (pathname.startsWith('/search')) {
            const parser = new URLParser(pathname, search);

            let translation: ITranslation;

            this.translationService
                .get(parser.getTranslation())
                .then((result) => {
                    translation = result;
                })
                .then(() => {
                    this.setState({
                        translation: translation,
                        search: {
                            search: search.substring(7, search.length),
                            isLoading: true,
                        },
                    });
                });
        }
    }

    protected toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen,
            tmpIsNavOpen: !this.state.isNavOpen,
        });
    }

    protected onChangeTranslation(translation: ITranslation) {
        const parser = new URLParser(this.props.location.pathname, this.props.location.search);

        if (parser.isSearchURL()) {
            this.history.push('/search/' + translation.abbreviation.toLowerCase() + this.props.location.search);

            return;
        }

        if (parser.isBookURL()) {
            this.history.push(
                '/book/' +
                    translation.abbreviation.toLowerCase() +
                    '/' +
                    this.state.book.id +
                    '/' +
                    this.state.chapterId,
            );

            return;
        }
    }

    protected onLogin() {
        this.setState({
            loggedIn: true,
        });
    }

    public componentDidMount() {
        this.init(this.props.location.pathname, this.props.location.search);

        this.unlisten = this.props.history.listen((location) => {
            this.init(location.pathname, location.search);
        });

        this.userService
            .me()
            .then(() => {
                this.setState({ loggedIn: true });
            })
            .catch(() => {
                this.setState({ loggedIn: false });
            });
    }

    public componentWillUnmount() {
        this.unlisten();
    }

    protected onChangeBook(book: IBook, chapterId: number, verseId: number) {
        const parser = new URLParser(this.props.location.pathname, this.props.location.search);

        if (!parser.isBookURL() && !this.state.isNavOpen) {
            return;
        }

        window.scrollTo(0, 0);

        if (verseId != 0) {
            this.history.push(
                '/book/' +
                    this.state.translation.abbreviation.toLowerCase() +
                    '/' +
                    book.id +
                    '/' +
                    chapterId +
                    '?verseId=' +
                    verseId,
            );

            return;
        }

        this.history.push(
            '/book/' + this.state.translation.abbreviation.toLowerCase() + '/' + book.id + '/' + chapterId,
        );
    }

    protected onSearch(search: string) {
        window.scrollTo(0, 0);

        this.history.push('/search/' + this.state.translation.abbreviation.toLowerCase() + '?query=' + search);
    }

    protected onChangeTitle(title: string, subTitle: string) {
        this.setState({
            title: title,
            subTitle: subTitle,
        });

        return;
    }

    protected toggleCrossRefModal(selectedVerse: IVerse | undefined, open: boolean) {
        let verseId = 0;

        if (selectedVerse?.verseId) {
            verseId = selectedVerse.verseId;
        }

        if (open) {
            this.setState({
                isNavOpen: false,
                verseId: verseId,
            });

            return;
        }

        this.setState({
            isNavOpen: this.state.tmpIsNavOpen,
            verseId: 0,
        });
    }

    public render(): JSX.Element {
        return (
            <div>
                <div id="topnav" className={`${this.state.isNavOpen ? 'nav-open' : ''}`}>
                    <div id="toggler" className="pl-2 pull-left">
                        <svg
                            onClick={() => this.toggleNav()}
                            className="toggle-leftnav-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 30 30"
                            width="30"
                            height="30"
                            focusable="false"
                        >
                            <title>Menu</title>
                            <path
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeMiterlimit="10"
                                d="M4 7h22M4 15h22M4 23h22"
                            ></path>
                        </svg>
                    </div>
                    <div className="ml-3 pull-left title">
                        <h2>
                            <b>{this.state.title}</b>
                            <span className="hide-xs">
                                &nbsp;<em>{this.state.subTitle}</em>
                            </span>
                        </h2>
                    </div>
                    <div className="pull-right translation-widget">
                        <TranslationSelector
                            selectedTranslation={this.state.translation}
                            onChange={(translation: ITranslation) => this.onChangeTranslation(translation)}
                        />
                        <UserMenu loggedIn={this.state.loggedIn} />
                    </div>
                </div>

                <div id="left-nav" className={`${this.state.isNavOpen ? 'nav-open' : ''}`}>
                    <div className="p-4">
                        <h4 className="mb-3">Keyword Search</h4>
                        <KeywordSearch
                            search={this.state.search.search}
                            onSearch={(search: string) => this.onSearch(search)}
                        />

                        <h4 className="mt-4 mb-3">Jump To Book</h4>
                        <BookSelector
                            selectedTranslation={this.state.translation}
                            selectedBook={this.state.book.id}
                            selectedChapter={this.state.chapterId}
                            selectedVerse={1}
                            showVerses={false}
                            showNavButtons={true}
                            onChange={(book: IBook, chapterId: number) => this.onChangeBook(book, chapterId, 0)}
                        />
                    </div>
                </div>
                <div id="main" className={`pl-5 pr-5 ${this.state.isNavOpen ? 'nav-open' : ''}`}>
                    <div id="content">
                        <Switch>
                            <Route path="/book/:translation/:bookId/:chapterId">
                                <TextDisplay
                                    translation={this.state.translation}
                                    bookId={this.state.book.id}
                                    chapterId={this.state.chapterId}
                                    verseId={this.state.verseId}
                                    toggleCrossRefModal={(selectedVerse: IVerse | undefined, open: boolean) =>
                                        this.toggleCrossRefModal(selectedVerse, open)
                                    }
                                />
                            </Route>

                            <Route path="/search/:translation">
                                <SearchResults
                                    changeTitle={(title, subTitle) => this.onChangeTitle(title, subTitle)}
                                    isLoading={this.state.search.isLoading}
                                    search={this.state.search.search}
                                    translationAbbr={this.state.translation.abbreviation}
                                    onChange={(book: IBook, chapterId: number, verseId: number) =>
                                        this.onChangeBook(book, chapterId, verseId)
                                    }
                                />
                            </Route>

                            <Route path="/user/login">
                                <LoginForm onLogin={() => this.onLogin()} />
                            </Route>

                            <Route path="/user/logout">
                                <Logout />
                            </Route>

                            <Route path="/user/register">
                                <RegistrationForm />
                            </Route>

                            <Route path="/list/:listId/verses">
                                <ListContent />
                            </Route>

                            <Route path="/list">
                                <ManageLists />
                            </Route>
                            <Redirect to="/book/kjv/1/1"></Redirect>
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(App);
