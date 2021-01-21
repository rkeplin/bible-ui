import React from 'react';
import TranslationSelector from './book/TranslationSelector';
import BookSelector from './book/BookSelector';
import KeywordSearch from './book/KeywordSearch';
import UserMenu from './book/UserMenu';

interface IState {
    isNavOpen: boolean;
}

class App extends React.Component<any, IState> {
    constructor(props: Record<string, unknown>) {
        super(props);

        this.state = {
            isNavOpen: true,
        };
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen,
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
                            <b>Genesis</b>
                            <span className="hide-xs"> - Old Testament</span>
                        </h2>
                    </div>
                    <div className="pull-right translation-widget">
                        <TranslationSelector></TranslationSelector>

                        <UserMenu></UserMenu>
                    </div>
                </div>

                <div id="left-nav" className={`${this.state.isNavOpen ? 'nav-open' : ''}`}>
                    <div className="p-4">
                        <h4 className="mb-3">Keyword Search</h4>
                        <KeywordSearch></KeywordSearch>

                        <h4 className="mt-4 mb-3">Jump To Book</h4>
                        <BookSelector></BookSelector>
                    </div>
                </div>
                <div id="main" className={`pl-5 pr-5 ${this.state.isNavOpen ? 'nav-open' : ''}`}>
                    <div id="content">
                        <div>
                            <div className="row">
                                <div className="col-md-6">
                                    <p>
                                        <a title="View Cross References" href="">
                                            <b>1:1</b>
                                        </a>
                                        &nbsp;Something something something...
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p>
                                        <a title="View Cross References" href="">
                                            <b>1:1</b>
                                        </a>
                                        &nbsp;Something something something...
                                    </p>
                                </div>
                            </div>
                            {/*<cross-reference-modal></cross-reference-modal>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
