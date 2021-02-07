import React from 'react';
import SearchService from './SearchService';
import ISearchResult from './ISearchResult';
import IVerse from '../book/IVerse';
import ISearchAggregation from './ISearchAggregation';
import IBook from '../book/IBook';
import SearchChart from './chart/SearchChart';

interface IProps {
    isLoading: boolean;
    search: string;
    translationAbbr: string;
    changeTitle: (title: string, subTitle: string) => void;
    onChange: (book: IBook, chapterId: number, verseId: number) => void;
}

interface IState {
    result: ISearchResult;
    isLoading: boolean;
    isLoadingCounts: boolean;
    otHits: number;
    ntHits: number;
}

class SearchResults extends React.Component<IProps, IState> {
    protected offset: number;
    protected limit: number;
    protected searchChart: any;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true,
            isLoadingCounts: true,
            result: {
                items: [],
                total: 0,
            },
            ntHits: 0,
            otHits: 0,
        };

        this.offset = 0;
        this.limit = 100;
    }

    private load() {
        this.props.changeTitle('Loading...', '');

        const service = new SearchService();

        this.setState({
            result: {
                items: this.offset === 0 ? [] : this.state.result.items,
                total: this.offset === 0 ? 0 : this.state.result.total,
            },
            isLoading: true,
        });

        service
            .getAll(this.props.search, this.props.translationAbbr, this.offset, this.limit)
            .then((result: ISearchResult) => {
                for (let i = 0; i < this.state.result.items.length; i++) {
                    result.items.unshift({
                        book: this.state.result.items[i].book,
                        chapterId: this.state.result.items[i].chapterId,
                        highlight: false,
                        id: this.state.result.items[i].id,
                        verse: this.state.result.items[i].verse,
                        verseId: this.state.result.items[i].verseId,
                    });
                }

                this.setState({
                    result: result,
                    isLoading: false,
                });

                this.props.changeTitle(
                    'Found ' + result.total.toLocaleString() + ' Results',
                    '  - In ' + this.props.translationAbbr,
                );
            });
    }

    private loadAggregate() {
        const service = new SearchService();

        this.setState({
            isLoadingCounts: true,
        });

        service
            .getAggregation(this.props.search, this.props.translationAbbr)
            .then((searchAggregation: ISearchAggregation[]) => {
                let otHits = 0;
                let ntHits = 0;

                for (let i = 0; i < searchAggregation.length; i++) {
                    if (i >= 39) {
                        ntHits += searchAggregation[i].hits;
                    } else {
                        otHits += searchAggregation[i].hits;
                    }
                }

                this.setState({
                    isLoadingCounts: false,
                    otHits: otHits,
                    ntHits: ntHits,
                });

                return searchAggregation;
            })
            .then((searchAggregation) => {
                this.searchChart.update(searchAggregation);
            });
    }

    private loadMore(e: React.MouseEvent): void {
        e.preventDefault();

        this.offset = this.offset + this.limit;

        this.load();
    }

    public componentDidMount() {
        this.load();
        this.loadAggregate();

        this.searchChart = new SearchChart('graph');
    }

    public onVerseClick(e: React.MouseEvent, verse: IVerse) {
        e.preventDefault();

        this.props.onChange(verse.book, verse.chapterId, verse.verseId);
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (prevProps.search === this.props.search) {
            if (prevProps.translationAbbr === this.props.translationAbbr) {
                return;
            }
        }

        this.offset = 0;

        this.load();
        this.loadAggregate();
    }

    public render(): JSX.Element {
        let loadMoreBtn;
        let oldTestBadge;
        let newTestBadge;

        if (this.state.result.total > this.state.result.items.length) {
            loadMoreBtn = (
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={(e) => this.loadMore(e)}
                        className={`btn btn-primary ${this.state.isLoading ? 'disabled' : ''}`}
                    >
                        Load More
                    </button>
                </div>
            );
        }

        if (this.state.isLoading) {
            oldTestBadge = (
                <span className="badge p-2 badge-secondary fw-600 otHitBadge mr-1">Old Testament - Loading...</span>
            );

            newTestBadge = (
                <span className="badge p-2 badge-secondary fw-600 ntHitBadge">New Testament - Loading...</span>
            );
        } else {
            oldTestBadge = (
                <span className="badge p-2 badge-secondary fw-600 otHitBadge mr-1">
                    Old Testament - {this.state.otHits.toLocaleString()}
                </span>
            );

            newTestBadge = (
                <span className="badge p-2 badge-secondary fw-600 ntHitBadge">
                    New Testament - {this.state.ntHits.toLocaleString()}
                </span>
            );
        }

        return (
            <div>
                <div className="row mb-4">
                    <div className="col-md-12">
                        {oldTestBadge}
                        {newTestBadge}
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-12">
                        <canvas id="graph" width="100%" height="275"></canvas>
                    </div>
                </div>

                <div className="row">
                    {this.state.result.items.map((item: IVerse, index: number) => {
                        return (
                            <div className="col-md-6" key={index}>
                                <div className="well mb20 p15 search-result">
                                    <p>
                                        <b>
                                            <a
                                                title="Navigate To Verse"
                                                href="#"
                                                onClick={(e: React.MouseEvent) => this.onVerseClick(e, item)}
                                            >
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

                {loadMoreBtn}
            </div>
        );
    }
}

export default SearchResults;
