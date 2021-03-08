import React from 'react';
import { RouteComponentProps, withRouter, match } from 'react-router-dom';
import ListService, { IList } from './ListService';
import IVerse from '../book/IVerse';
import { AxiosError } from 'axios';

interface IState {
    isLoadingList: boolean;
    isLoading: boolean;
    list: IList;
    verses: IVerse[];
    selectedVerse: IVerse;
    allowAdd: boolean;
    displayAddDialog: boolean;
    displayDeleteDialog: boolean;
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

    constructor(props: any) {
        super(props);

        this.listService = new ListService();

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
                book: {
                    id: 0,
                    testament: '',
                    name: '',
                },
                chapterId: 0,
                id: 0,
                verse: '',
                verseId: 0,
                highlight: false,
            },
            verses: [],
            allowAdd: true,
            displayAddDialog: false,
            displayDeleteDialog: false,
        };
    }

    private onAddClick(event: React.MouseEvent) {
        event.preventDefault();

        this.setState({
            displayAddDialog: true,
        });
    }

    private onDeleteClick(event: React.MouseEvent, verse: IVerse) {
        event.preventDefault();

        this.setState({
            selectedVerse: verse,
            displayDeleteDialog: true,
        });
    }

    private remove(verse: IVerse) {
        console.log(verse);
    }

    private load() {
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
            .then((verses) => {
                this.setState({
                    isLoadingList: false,
                    verses: verses,
                });
            })
            .catch((error: AxiosError) => {
                this.handleError(error);
            });
    }

    public handleError(error: AxiosError) {
        if (error.response?.status === 401) {
            this.props.history.push('/user/login');

            window.scrollTo(0, 0);
        }
    }

    public componentDidMount() {
        this.load();
    }

    public render(): JSX.Element {
        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        {this.state.list.name || 'Loading...'}

                        <button
                            className="btn btn-secondary btn-sm pull pull-right"
                            disabled={!this.state.allowAdd}
                            onClick={(event: React.MouseEvent) => this.onAddClick(event)}
                        >
                            Add Verse
                        </button>
                    </div>
                    <div className="card-body">
                        <div
                            style={{
                                display: !this.state.verses.length && !this.state.isLoadingList ? 'block' : 'none',
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

                        {this.state.verses.map((verse: IVerse, index: number) => {
                            return (
                                <div className="well bg-gray mb20 p15" key={index}>
                                    <p>
                                        <b>{verse.book.name}</b> -{' '}
                                        <i>
                                            {verse.book.testament} ({verse.translation})
                                        </i>
                                        <a
                                            className="pull pull-right"
                                            title="Remove from list"
                                            href=""
                                            onClick={(event: React.MouseEvent) => this.onDeleteClick(event, verse)}
                                        >
                                            [x]
                                        </a>
                                    </p>
                                    <p>
                                        <b>
                                            <a href="">
                                                {verse.chapterId}:{verse.verseId}
                                            </a>
                                        </b>
                                        {verse.verse}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="overlay" style={{ display: this.state.displayAddDialog ? 'block' : 'none' }}>
                    <div className="dialog">
                        Add verse form here...
                        {/*<add-verse-form list-id="vm.listId"></add-verse-form>*/}
                    </div>
                </div>

                <div className="overlay" style={{ display: this.state.displayDeleteDialog ? 'block' : 'none' }}>
                    <div className="dialog">
                        <div className="card">
                            <div className="card-header">Remove Verse</div>
                            <div className="card-body">
                                Are you sure that you want to remove{' '}
                                <b>
                                    {this.state.selectedVerse.book.name} {this.state.selectedVerse.chapterId}:
                                    {this.state.selectedVerse.verseId} ({this.state.selectedVerse.translation})
                                </b>{' '}
                                from this list?
                            </div>
                            <div className="card-footer text-right">
                                <button
                                    className="btn btn-default"
                                    onClick={() => this.setState({ displayDeleteDialog: false })}
                                >
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
