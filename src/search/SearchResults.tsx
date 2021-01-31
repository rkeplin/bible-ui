import React from 'react';
import SearchService from './SearchService';
import ISearchResult from './ISearchResult';
import IVerse from '../book/IVerse';

interface IProps {
    isLoading: boolean;
    search: string;
    translationAbbr: string;
    changeTitle: (title: string, subTitle: string) => void;
}

interface IState {
    result: ISearchResult;
}

class SearchResults extends React.Component<IProps, IState> {
    protected offset: number;
    protected limit: number;

    constructor(props: any) {
        super(props);

        this.state = {
            result: {
                items: [],
                total: 0,
            },
        };

        this.offset = 0;
        this.limit = 100;
    }

    private load() {
        this.props.changeTitle('Loading...', '');

        const service = new SearchService();

        service
            .getAll(this.props.search, this.props.translationAbbr, this.offset, this.limit)
            .then((result: ISearchResult) => {
                this.setState({
                    result: result,
                });

                this.props.changeTitle('Found ' + result.total + ' Results', '');
            });
    }

    public componentDidMount() {
        this.load();
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (prevProps.search === this.props.search) {
            if (prevProps.translationAbbr === this.props.translationAbbr) {
                return;
            }
        }

        this.load();
    }

    public render(): JSX.Element {
        return (
            <div>
                {/*<div className="row mb-4">*/}
                {/*    <div className="col-md-12">*/}
                {/*        <span className="badge p-2 badge-secondary fw-600 otHitBadge">Old Testament - <span*/}
                {/*            ng-show="vm.isLoadingCounts">Loading...</span><span ng-show="!vm.isLoadingCounts">{{*/}
                {/*            vm*/}
                {/*            .otHits | number*/}
                {/*        }} Results</span></span>*/}
                {/*        <span className="badge p-2 badge-secondary fw-600 ntHitBadge">New Testament - <span*/}
                {/*            ng-show="vm.isLoadingCounts">Loading...</span><span ng-show="!vm.isLoadingCounts">{{*/}
                {/*            vm*/}
                {/*            .ntHits | number*/}
                {/*        }} Results</span></span>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className="row mb-3">*/}
                {/*    <div className="col-md-12">*/}
                {/*        <canvas id="graph" width="100%" height="275"></canvas>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="row">
                    {this.state.result.items.map((item: IVerse, index: number) => {
                        return (
                            <div className="col-md-6" key={index}>
                                <div className="well mb20 p15 search-result">
                                    <p>
                                        <b>
                                            <a title="Navigate To Verse" href="#">
                                                {item.book.name} {item.chapterId}:{item.verseId}
                                            </a>
                                        </b>
                                        &nbsp;-&nbsp;<i>{item.book.testament}</i>
                                    </p>

                                    <p dangerouslySetInnerHTML={{ __html: item.verse }}></p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/*<div style={{'text-align': 'center'}}>*/}
                {/*    <button ng-show="vm.result.total > vm.result.items.length" ng-disabled="vm.isLoading"*/}
                {/*            ng-click="vm.loadMore()" className="btn btn-primary">Load More*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        );
    }
}

export default SearchResults;
