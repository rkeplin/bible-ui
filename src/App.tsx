import React from 'react';
import TranslationSelector from './book/TranslationSelector';
import BookSelector from './book/BookSelector';
import KeywordSearch from './book/KeywordSearch';
import UserMenu from './user/UserMenu';
import TextDisplay from './book/TextDisplay';
import IBook from './book/IBook';
import ITranslation from './book/ITranslation';

interface IState {
    translation: ITranslation;
    book: IBook;
    chapterId: number;
    isNavOpen: boolean;
    tmpIsNavOpen: boolean;
}

class App extends React.Component<any, IState> {
    constructor(props: Record<string, unknown>) {
        super(props);

        this.state = {
            translation: {
                id: 4,
                abbreviation: 'KJV',
                version: 'King James Version',
            },
            book: {
                id: 1,
                testament: 'OT',
                name: 'Genesis',
            },
            chapterId: 1,
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
    }

    onChangeBook(book: IBook, chapterId: number) {
        this.setState({
            book: book,
            chapterId: chapterId,
        });
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
                            onChange={(book: IBook, chapterId: number) => this.onChangeBook(book, chapterId)}
                        />
                    </div>
                </div>
                <div id="main" className={`pl-5 pr-5 ${this.state.isNavOpen ? 'nav-open' : ''}`}>
                    <div id="content">
                        <TextDisplay
                            translation={this.state.translation}
                            bookId={this.state.book.id}
                            chapterId={this.state.chapterId}
                            toggleCrossRefModal={(open) => this.toggleCrossRefModal(open)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
