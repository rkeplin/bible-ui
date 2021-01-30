import React from 'react';
import TranslationSelector from './book/TranslationSelector';
import BookSelector from './book/BookSelector';
import KeywordSearch from './book/KeywordSearch';
import UserMenu from './user/UserMenu';
import TextDisplay from './book/TextDisplay';
import IBook from './book/IBook';
import ITranslation from './book/ITranslation';
import { Switch, Route, Link, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';

interface IState {
    translation: ITranslation;
    book: IBook;
    chapterId: number;
    isNavOpen: boolean;
    tmpIsNavOpen: boolean;
}

class App extends React.Component<RouteComponentProps, IState> {
    protected history: any;

    constructor(props: RouteComponentProps) {
        super(props);

        this.history = this.props.history;

        // TODO: Encapsulate stuff

        const regex = /\/book\/([a-z]{3,4})\/([\d]{1,3})\/([\d]{1,3})/;
        const matches = this.props.location.pathname.match(regex);

        const translation: ITranslation = {
            id: 4,
            abbreviation: 'KJV',
            version: 'King James Version',
        };

        const book: IBook = {
            id: 1,
            testament: 'OT',
            name: 'Genesis',
        };

        let chapter = 1;

        if (matches !== null && matches.length >= 4) {
            // TODO: Pull from API
            translation.id = 1;
            translation.abbreviation = matches[1].toUpperCase();
            translation.version = '';

            // TODO: Pull from API
            book.id = parseInt(matches[2]);
            book.testament = 'OT';
            book.name = 'Genesis';

            chapter = parseInt(matches[3]);
        }

        this.state = {
            translation: translation,
            book: book,
            chapterId: chapter,
            isNavOpen: true,
            tmpIsNavOpen: true,
        };
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen,
            tmpIsNavOpen: !this.state.isNavOpen,
        });
    }

    onChangeTranslation(translation: ITranslation) {
        this.setState({
            translation: translation,
        });

        this.history.push(
            '/book/' + translation.abbreviation.toLowerCase() + '/' + this.state.book.id + '/' + this.state.chapterId,
        );
    }

    onChangeBook(book: IBook, chapterId: number) {
        this.setState({
            book: book,
            chapterId: chapterId,
        });

        this.history.push(
            '/book/' + this.state.translation.abbreviation.toLowerCase() + '/' + book.id + '/' + chapterId,
        );
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
                            <b>{this.state.book.name}</b>
                            <span className="hide-xs">
                                {' '}
                                - {`${this.state.book.testament == 'OT' ? 'Old' : 'New'} Testament`}
                            </span>
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
                        <KeywordSearch />

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
                        <Link to="/search">Search</Link>

                        <Link to="/">Home</Link>

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
                                <div>Search results here...</div>
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
