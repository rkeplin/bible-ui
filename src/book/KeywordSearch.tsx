import React from 'react';

interface IState {
    search: string;
}

interface IProps {
    search: string;
    onSearch: (search: string) => void;
}

class KeywordSearch extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search: this.props.search,
        };
    }

    protected search() {
        if (this.state.search.length < 1) {
            return;
        }

        if (this.state.search.length > 100) {
            return;
        }

        this.props.onSearch(this.state.search);
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (prevProps.search !== this.props.search) {
            this.setState({
                search: this.props.search,
            });
        }
    }

    protected handleKeyPress(event: any /* React.KeyboardEvent<HTMLInputElement> */) {
        if (event.key.toUpperCase() !== 'ENTER') {
            return;
        }

        this.setState({
            search: event.target.value,
        });

        this.search();
    }

    protected handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            search: event.target.value,
        });
    }

    public render(): JSX.Element {
        return (
            <div className="search-widget">
                <div className="row">
                    <div className="col-8 pr-1">
                        <input
                            name="searchInput"
                            id="searchInput"
                            placeholder="Enter Search..."
                            value={this.state.search}
                            onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => this.handleKeyPress(event)}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.handleChange(event)}
                        ></input>
                    </div>

                    <div className="col-4 pl-1">
                        <button className="btn btn-primary" onClick={() => this.search()}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default KeywordSearch;
