import React from 'react';

class SearchInput extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): JSX.Element {
        return (
            <div className="search-widget">
                <div className="row">
                    <div className="col-8 pr-1">
                        <input name="searchInput" id="searchInput" placeholder="Enter Search..."></input>
                    </div>

                    <div className="col-4 pl-1">
                        <button className="btn btn-primary">Search</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchInput;
