import React from 'react';
import TranslationSelector from './book/TranslationSelector';
import BookSelector from './book/BookSelector';
import KeywordSearch from './book/KeywordSearch';
import UserMenu from './user/UserMenu';
import TextDisplay from './book/TextDisplay';
import IBook from './book/IBook';
import ITranslation from './book/ITranslation';
import { Switch, Route, Link, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import URLParser from './book/URLParser';
import BookService from './book/BookService';
import TranslationService from './book/TranslationService';
import SearchResults from './search/SearchResults';

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
    isNavOpen: boolean;
    tmpIsNavOpen: boolean;
    search: ISearch;
}

class App extends React.Component<RouteComponentProps, IState> {
    protected history: any;

    protected unlisten: any;

    protected bookService: BookService;

    protected translationService: TranslationService;

    constructor(props: RouteComponentProps) {
        super(props);

        this.bookService = new BookService();
        this.translationService = new TranslationService();

        this.history = this.props.history;

        const parser = new URLParser(this.props.location.pathname);

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
            isNavOpen: true,
            tmpIsNavOpen: true,
        };
    }

    init(pathname: string, search: string) {
        if (pathname.startsWith('/book')) {
            // Skip if we aren't on the book page and the nav is closed
            const parser = new URLParser(pathname);

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
                    });
                });
        }

        if (pathname.startsWith('/search')) {
            this.setState({
                search: {
                    search: search.substring(7, search.length),
                    isLoading: true,
                },
            });
        }
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen,
            tmpIsNavOpen: !this.state.isNavOpen,
        });
    }

    onChangeTranslation(translation: ITranslation) {
        const parser = new URLParser(this.props.location.pathname);

        if (!parser.isBookURL()) {
            return;
        }

        this.history.push(
            '/book/' + translation.abbreviation.toLowerCase() + '/' + this.state.book.id + '/' + this.state.chapterId,
        );
    }

    componentDidMount() {
        this.init(this.props.location.pathname, this.props.location.search);

        this.unlisten = this.props.history.listen((location) => {
            this.init(location.pathname, location.search);
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    onChangeBook(book: IBook, chapterId: number) {
        const parser = new URLParser(this.props.location.pathname);

        if (!parser.isBookURL() && !this.state.isNavOpen) {
            return;
        }

        this.history.push(
            '/book/' + this.state.translation.abbreviation.toLowerCase() + '/' + book.id + '/' + chapterId,
        );
    }

    onSearch(search: string) {
        this.history.push('/search?query=' + search);
    }

    onChangeTitle(title: string, subTitle: string) {
        this.setState({
            title: title,
            subTitle: subTitle,
        });

        return;
    }

    toggleCrossRefModal(open: boolean) {
        if (open) {
            this.setState({
                isNavOpen: false,
            });

            return;
        }

        this.setState({
            isNavOpen: this.state.tmpIsNavOpen,
        });
    }

    render(): JSX.Element {
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
                            <span className="hide-xs">&nbsp;{this.state.subTitle}</span>
                        </h2>
                    </div>
                    <div className="pull-right translation-widget">
                        <TranslationSelector
                            selectedTranslation={this.state.translation}
                            onChange={(translation: ITranslation) => this.onChangeTranslation(translation)}
                        />
                        <UserMenu />
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
                            selectedBook={this.state.book.id}
                            selectedChapter={this.state.chapterId}
                            onChange={(book: IBook, chapterId: number) => this.onChangeBook(book, chapterId)}
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
                                    toggleCrossRefModal={(open) => this.toggleCrossRefModal(open)}
                                />
                            </Route>

                            <Route path="/search">
                                <SearchResults
                                    changeTitle={(title, subTitle) => this.onChangeTitle(title, subTitle)}
                                    isLoading={this.state.search.isLoading}
                                    search={this.state.search.search}
                                    translationAbbr={this.state.translation.abbreviation}
                                />
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
